import nodemailer from "nodemailer";

async function run() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Please set EMAIL_USER and EMAIL_PASS environment variables before running this test.");
    process.exit(1);
  }

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

  try {
    console.log("Verifying transporter... (this will attempt to connect to SMTP)");
    await transporter.verify();
    console.log("SMTP configuration appears to be valid. You can send mail.");
  } catch (err) {
    console.error("SMTP verification failed:", err);
    console.error("Common causes: wrong username/password, account blocks, need app password or OAuth2, or provider restrictions.");
    process.exitCode = 2;
  }
}

run();
