import { Injectable } from "@nestjs/common";
import { WebhookPaymentBodyType } from "src/routes/payment/models/payment.model";
import { PaymentRepo } from "src/routes/payment/payment.repo";

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepo: PaymentRepo) {}

  async receiver(body: WebhookPaymentBodyType) {
    await this.paymentRepo.receiver(body);
    return {
      message: "Payment received successfully",
    };
  }
}
