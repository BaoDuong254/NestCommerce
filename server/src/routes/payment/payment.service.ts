import { Injectable } from "@nestjs/common";
import { PaymentRepo } from "src/routes/payment/payment.repo";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { generateRoomUserId } from "src/shared/helpers";
import { WebhookPaymentBodyType } from "src/routes/payment/models/payment.model";

@Injectable()
@WebSocketGateway({ namespace: "/api/v1/payment" })
export class PaymentService {
  @WebSocketServer()
  server: Server;
  constructor(private readonly paymentRepo: PaymentRepo) {}

  async receiver(body: WebhookPaymentBodyType) {
    const userId = await this.paymentRepo.receiver(body);
    this.server.to(generateRoomUserId(userId)).emit("payment", {
      status: "success",
    });
    return {
      message: "Payment received successfully",
    };
  }
}
