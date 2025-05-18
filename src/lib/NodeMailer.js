import { config } from "dotenv";
import nodemailer from "nodemailer";
config();
export const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: "honeyrai591@gmail.com",
    pass: process.env.GMAIL_PASS,
  },
});

export const sendEmail = async (email, number) => {
  const info = await transporter.sendMail({
    from: "My Chat <honeyrai591@gmail.com>",
    to: "raihanzala591@gmail.com",
    subject: "Verify Your Email By My Chat",
    text: `Code is Send From My Chat ${number}`, // plain‑text body
    html: `<b>Code is Send From My Chat ${number}</b>`, // HTML body
  });
};
