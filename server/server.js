import express from "express";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/hello", (req, res) => {
  res.json({ message: "hii" });
});

app.post("/send", async (req, res) => {
  console.log('/send called with body:', req.body);
  const { name, email, number, date, message } = req.body;

  if (!name || !email || !number || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Gmail API via OAuth2 (works over HTTPS — avoids blocked SMTP ports on hosts)
    const gmailClientId = process.env.GMAIL_CLIENT_ID;
    const gmailClientSecret = process.env.GMAIL_CLIENT_SECRET;
    const gmailRefreshToken = process.env.GMAIL_REFRESH_TOKEN;
    const gmailUser = process.env.GMAIL_USER; // email address to use as sender

    if (gmailClientId && gmailClientSecret && gmailRefreshToken && gmailUser) {
      try {
        const oAuth2Client = new google.auth.OAuth2(gmailClientId, gmailClientSecret);
        oAuth2Client.setCredentials({ refresh_token: gmailRefreshToken });
        // getAccessToken will use the refresh token to obtain a fresh access token
        const accessTokenResponse = await oAuth2Client.getAccessToken();
        const accessToken = accessTokenResponse && accessTokenResponse.token ? accessTokenResponse.token : null;

        if (!accessToken) {
          console.error('Unable to obtain Gmail access token');
          // fall through to SMTP fallback if configured
        } else {
          const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
          const html = `
            <h2>Visitor Details</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mobile Number:</strong> ${number}</p>
            <p><strong>Date of Visit:</strong> ${date}</p>
            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
          `;
          const raw = [
            `From: ${gmailUser}`,
            `To: gojungleeadventures@gmail.com`,
            `Reply-To: ${email}`,
            `Subject: New Visitor Entry from ${name}`,
            'Content-Type: text/html; charset=UTF-8',
            '',
            html,
          ].join('\r\n');

          const encoded = Buffer.from(raw)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

          await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw: encoded },
          });

          console.log('Email sent via Gmail API');
          return res.json({ message: 'Email sent successfully!' });
        }
      } catch (gmailErr) {
        console.error('Gmail API send error:', gmailErr && gmailErr.message ? gmailErr.message : gmailErr);
        // fall through to SMTP fallback
      }
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.error("SMTP_USER or SMTP_PASS is not set in environment variables");
      return res.status(500).json({ message: "Email service not configured." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      logger: true,
      debug: true,
    });

    try {
      await transporter.verify();
      console.log('SMTP connection verified');
    } catch (verifyErr) {
      console.error('SMTP verify failed:', verifyErr);
      return res.status(500).json({ message: 'Email service not available.' });
    }

    const mailOptions = {
      from: email,
      to: "gojungleeadventures@gmail.com",
      subject: `New Visitor Entry from ${name}`,
      html: `
        <h2>Visitor Details</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile Number:</strong> ${number}</p>
        <p><strong>Date of Visit:</strong> ${date}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info && info.response ? info.response : info);
    res.json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: "Failed to send message. Please try again later." });
  }
});

// Lightweight health check endpoint for uptime monitors and Render cron pings
app.get("/__health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
