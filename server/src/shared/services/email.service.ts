import { Injectable } from "@nestjs/common";
import { Resend } from "resend";
import envConfig from "src/shared/config";

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
      subject: "Your verification code",
      html: `<strong>${payload.code}</strong>`,
    });
  }
}
