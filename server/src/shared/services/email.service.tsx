import { Injectable } from "@nestjs/common";
import { Resend } from "resend";
import envConfig from "src/shared/config";
import ms, { StringValue } from "ms";
import * as React from "react";
import OtpEmail from "src/shared/emails/otp";

const subjectTemplate = "Verify Your Email";
const expiryTime = ms(envConfig.OTP_EXPIRES_IN as StringValue) / 1000 / 60; // convert to minutes

@Injectable()
export class EmailService {
  private resend: Resend;
  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY);
  }
  async sendOTP(payload: { email: string; code: string }) {
    return this.resend.emails.send({
      from: "NestCommerce <onboarding@resend.dev>",
      to: ["duonggiabao254@gmail.com"],
      subject: subjectTemplate,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      react: <OtpEmail code={payload.code} expiryTime={expiryTime} title={subjectTemplate} />,
    });
  }
}
