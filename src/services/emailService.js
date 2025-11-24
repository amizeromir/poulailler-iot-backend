// src/utils/mailer.js
import nodemailer from "nodemailer";
 
export const mailer = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // utile dans Codespaces / serveurs cloud
  },
});
 
export async function sendAlertEmail(subject, message) {
  try {
    await mailer.sendMail({
      from: `"Alerte Poulailler" <${process.env.ALERT_EMAIL}>`,
      to: process.env.ALERT_EMAIL_TO,
      subject,
      text: message,
    });
 
    console.log("📧 Email d'alerte envoyé !");
  } catch (error) {
    console.error("❌ Erreur envoi email:", error);
  }
}