// lib/mailer.js
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"QuickCart" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};
