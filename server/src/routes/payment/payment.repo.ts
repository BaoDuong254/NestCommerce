import { BadRequestException, Injectable } from "@nestjs/common";
import { parse } from "date-fns";
import { WebhookPaymentBodyType } from "src/routes/payment/models/payment.model";
import { PaymentProducer } from "src/routes/payment/payment.producer";
import { OrderStatus } from "src/shared/constants/order.constant";
import { PREFIX_PAYMENT_CODE } from "src/shared/constants/other.constant";
import { PaymentStatus } from "src/shared/constants/payment.constant";
import { SerializeAll } from "src/shared/decorators/serialize.decorator";
import { PrismaService } from "src/shared/services/prisma.service";

@Injectable()
@SerializeAll()
export class PaymentRepo {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly paymentProducer: PaymentProducer
  ) {}

  async receiver(body: WebhookPaymentBodyType): Promise<number> {
    // Reference: https://docs.sepay.vn/lap-trinh-webhooks.html
    let amountIn = 0;
    let amountOut = 0;
    if (body.transferType === "in") {
      amountIn = body.transferAmount;
    } else if (body.transferType === "out") {
      amountOut = body.transferAmount;
    }
    const paymentTransaction = await this.prismaService.paymentTransaction.findUnique({
      where: {
        id: body.id,
      },
    });
    if (paymentTransaction) {
      throw new BadRequestException("Transaction already exists");
    }
    const userId = await this.prismaService.$transaction(async (tx) => {
      // 1. Insert transaction record to database
      await tx.paymentTransaction.create({
        data: {
          id: body.id,
          gateway: body.gateway,
          transactionDate: parse(body.transactionDate, "yyyy-MM-dd HH:mm:ss", new Date()),
          accountNumber: body.accountNumber,
          subAccount: body.subAccount,
          amountIn,
          amountOut,
          accumulated: body.accumulated,
          code: body.code,
          transactionContent: body.content,
          referenceNumber: body.referenceCode,
          body: body.description,
        },
      });

      // 2. Check payment and money info valid with orders
      const extractPaymentId = (text: string | null): number => {
        if (!text) return NaN;
        const match = text.match(new RegExp(`${PREFIX_PAYMENT_CODE}(\\d+)`, "i"));
        return match ? Number(match[1]) : NaN;
      };

      const paymentId = extractPaymentId(body.code) || extractPaymentId(body.content);
      if (isNaN(paymentId)) {
        throw new BadRequestException("Cannot get payment id from content");
      }

      const payment = await tx.payment.findUnique({
        where: {
          id: paymentId,
        },
        include: {
          orders: {
            include: {
              items: true,
            },
          },
        },
      });
      if (!payment) {
        throw new BadRequestException(`Cannot find payment with id ${paymentId}`);
      }
      if (!payment.orders || payment.orders.length === 0) {
        throw new BadRequestException(`Payment ${paymentId} has no orders`);
      }
      const userId = payment.orders[0].userId;
      const { orders } = payment;

      // Calculate total price from orders
      let totalPrice = 0;
      for (const order of orders) {
        if (!order.items || order.items.length === 0) {
          throw new BadRequestException(`Order ${order.id} has no items`);
        }
        for (const item of order.items) {
          totalPrice += item.skuPrice * item.quantity;
        }
      }

      if (totalPrice !== body.transferAmount) {
        throw new BadRequestException(`Price not match, expected ${totalPrice} but got ${body.transferAmount}`);
      }

      // 3. Update payment status and order status
      await Promise.all([
        tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            status: PaymentStatus.SUCCESS,
          },
        }),
        tx.order.updateMany({
          where: {
            id: {
              in: orders.map((order) => order.id),
            },
          },
          data: {
            status: OrderStatus.PENDING_PICKUP,
          },
        }),
        this.paymentProducer.removeJob(paymentId),
      ]);
      return userId;
    });

    return userId;
  }
}
