import { Injectable } from "@nestjs/common";
import { Resend } from "resend";
import envConfig from "src/shared/config";
import path from "path";
import fs from "fs";
import ms, { StringValue } from "ms";

const otpTemplate = fs.readFileSync(path.resolve("src/shared/emails/otp.html"), "utf8");
const subjectTemplate = "Verify Your Email";
const expiryTime = ms(envConfig.OTP_EXPIRES_IN as StringValue) / 1000 / 60; // convert to minutes
const year = new Date().getFullYear();

@Injectable()
export class EmailService {
  private resend: Resend;
  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY);
  }
  async sendOTP(payload: { email: string; code: string }) {
    return this.resend.emails.send({
      from: "Ecommerce <onboarding@resend.dev>",
      to: ["duonggiabao254@gmail.com"],
      subject: subjectTemplate,
      html: otpTemplate
        .replaceAll("{{CODE}}", payload.code)
        .replaceAll("{{TITLE}}", subjectTemplate)
        .replaceAll("{{EXPIRY_TIME}}", expiryTime.toString())
        .replaceAll("{{YEAR}}", year.toString()),
    });
  }
}
