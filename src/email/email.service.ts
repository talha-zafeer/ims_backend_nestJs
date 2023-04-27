import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendPasswordResetEmail(email: string, otp: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is ${otp}. Please use this OTP to reset your password.`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}

export default EmailService;
