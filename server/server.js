import express from "express";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../client/build")));

app.post("/send", async (req, res) => {
  const { name, email, number, date } = req.body;

  if (!name || !email || !number || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Prefer OAuth2 if OAuth env vars are provided for Gmail
    let transportOptions;
    const hasOAuth =
      process.env.EMAIL_OAUTH_CLIENT_ID &&
      process.env.EMAIL_OAUTH_CLIENT_SECRET &&
      process.env.EMAIL_OAUTH_REFRESH_TOKEN &&
      process.env.EMAIL_USER;

    if (hasOAuth) {
      console.log("Using OAuth2 authentication for Gmail");
      
      const oAuth2Client = new google.auth.OAuth2(
        process.env.EMAIL_OAUTH_CLIENT_ID,
        process.env.EMAIL_OAUTH_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
      );
      
      oAuth2Client.setCredentials({ 
        refresh_token: process.env.EMAIL_OAUTH_REFRESH_TOKEN 
      });

      let accessTokenResponse;
      try {
        accessTokenResponse = await oAuth2Client.getAccessToken();
        console.log("Successfully obtained access token");
      } catch (err) {
        console.error("Failed to obtain access token:", err.message);
        console.error("Full error:", err);
        return res.status(500).json({ 
          message: "Email authentication failed. Please check OAuth credentials." 
        });
      }

      // getAccessToken() returns an object with `token` property
      const accessToken = accessTokenResponse?.token;
      
      if (!accessToken) {
        console.error("No access token received from OAuth2Client");
        return res.status(500).json({ 
          message: "Failed to generate access token." 
        });
      }

      transportOptions = {
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL_USER,
          clientId: process.env.EMAIL_OAUTH_CLIENT_ID,
          clientSecret: process.env.EMAIL_OAUTH_CLIENT_SECRET,
          refreshToken: process.env.EMAIL_OAUTH_REFRESH_TOKEN,
          accessToken,
        },
      };
    } else {
      console.log("OAuth2 variables not found, using SMTP fallback");
      
      // Fallback to SMTP or simple username/password
      if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASS && !process.env.EMAIL_HOST)) {
        console.error("Email configuration missing. Provide OAuth2 vars or EMAIL_USER + EMAIL_PASS or SMTP host.");
        return res.status(500).json({ message: "Email service not configured." });
      }

      if (process.env.EMAIL_HOST) {
        transportOptions = {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
          secure: process.env.EMAIL_SECURE === "true",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        };
      } else {
        transportOptions = {
          service: process.env.EMAIL_SERVICE || "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        };
      }
    }

    const transporter = nodemailer.createTransport(transportOptions);

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log("Email transporter verified successfully");
    } catch (verifyError) {
      console.error("Transporter verification failed:", verifyError.message);
      return res.status(500).json({ 
        message: "Email service configuration error." 
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER, // Use authenticated user as sender
      replyTo: email, // Set visitor's email as reply-to
      to: "gojungleeadventures@gmail.com",
      subject: `New Visitor Entry from ${name}`,
      html: `
        <h2>Visitor Details</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile Number:</strong> ${number}</p>
        <p><strong>Date of Visit:</strong> ${date}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to gojungleeadventures@gmail.com");
    res.json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ message: "Failed to send message. Please try again later." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
