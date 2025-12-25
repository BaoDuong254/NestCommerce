import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ namespace: "/api/v1/payment" })
export class PaymentGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("send-money")
  handleEvent(@MessageBody() data: string): string {
    this.server.emit("receive-money", {
      data: `Money: ${data}`,
    });
    return data;
  }
}
