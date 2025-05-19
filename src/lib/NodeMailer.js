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
    to: email,
    subject: "Verify Your Email By My Chat",
    text: `Code is Send From My Chat ${number}`, // plain‑text body
    html: `
    <div>
    Code is Send From My Chat <br/>
    Your Code is : 
    <b>${number}</b></div>`, // HTML body
  });
};
