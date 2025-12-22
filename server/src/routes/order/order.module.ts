import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { OrderService } from "./order.service";
import { OrderRepo } from "./order.repo";
import { OrderController } from "src/routes/order/order.controller";
import { OrderProducer } from "src/routes/order/order.producer";
import { PAYMENT_QUEUE_NAME } from "src/shared/constants/queue.constant";

@Module({
  imports: [
    BullModule.registerQueue({
      name: PAYMENT_QUEUE_NAME,
    }),
  ],
  providers: [OrderService, OrderRepo, OrderProducer],
  controllers: [OrderController],
})
export class OrderModule {}
