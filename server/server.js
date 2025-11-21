import express from "express";
import nodemailer from "nodemailer";
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
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("EMAIL_USER or EMAIL_PASS not set in environment");
      return res.status(500).json({ message: "Email service not configured." });
    }

    // Support either a named service (like 'gmail') or explicit SMTP settings.
    let transportOptions;
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

    const transporter = nodemailer.createTransport(transportOptions);

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
      `,
    };

    await transporter.sendMail(mailOptions);
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
