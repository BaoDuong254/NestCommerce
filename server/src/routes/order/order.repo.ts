import { Injectable } from "@nestjs/common";
import {
  CannotCancelOrderException,
  NotFoundCartItemException,
  OrderNotFoundException,
  OutOfStockSKUException,
  ProductNotFoundException,
  SKUNotBelongToShopException,
} from "src/routes/order/order.error";
import {
  CancelOrderResType,
  CreateOrderBodyType,
  CreateOrderResType,
  GetOrderDetailResType,
  GetOrderListQueryType,
  GetOrderListResType,
} from "src/routes/order/models/order.model";
import { VersionConflictException } from "src/shared/error";
import { isNotFoundPrismaError } from "src/shared/helpers";
import { PrismaService } from "src/shared/services/prisma.service";
import { Prisma } from "generated/prisma";
import { OrderStatus } from "src/shared/constants/order.constant";
import { PaymentStatus } from "src/shared/constants/payment.constant";
import { OrderProducer } from "src/routes/order/order.producer";

@Injectable()
export class OrderRepo {
  constructor(
    private readonly prismaService: PrismaService,
    private orderProducer: OrderProducer
  ) {}
  async list(userId: number, query: GetOrderListQueryType): Promise<GetOrderListResType> {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;
    const take = limit;
    const where: Prisma.OrderWhereInput = {
      userId,
      status,
    };

    // Count all order items
    const totalItem$ = this.prismaService.order.count({
      where,
    });
    // Fetch order items with pagination
    const data$ = this.prismaService.order.findMany({
      where,
      include: {
        items: true,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
    const [data, totalItems] = await Promise.all([data$, totalItem$]);
    return {
      data,
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };
  }

  async create(
    userId: number,
    body: CreateOrderBodyType
  ): Promise<{
    paymentId: number;
    orders: CreateOrderResType["orders"];
  }> {
    // 1. Check if all cartItemIds exist in the database
    // 2. Check if the purchase quantity exceeds the stock quantity
    // 3. Check if all purchased products are deleted or hidden
    // 4. Check if the skuIds in the cartItem sent belong to the shopId sent
    // 5. Create order and delete cartItem in transaction to ensure data integrity
    const allBodyCartItemIds = body.map((item) => item.cartItemIds).flat();

    const [paymentId, orders] = await this.prismaService.$transaction<[number, CreateOrderResType["orders"]]>(
      async (tx) => {
        const cartItems = await tx.cartItem.findMany({
          where: {
            id: {
              in: allBodyCartItemIds,
            },
            userId,
          },
          include: {
            sku: {
              include: {
                product: {
                  include: {
                    productTranslations: true,
                  },
                },
              },
            },
          },
        });

        // 1. Check if all cartItemIds exist in the database
        if (cartItems.length !== allBodyCartItemIds.length) {
          throw NotFoundCartItemException;
        }

        // 2. Check if the purchase quantity exceeds the stock quantity
        const isOutOfStock = cartItems.some((item) => {
          return item.sku.stock < item.quantity;
        });
        if (isOutOfStock) {
          throw OutOfStockSKUException;
        }

        // 3. Check if all purchased products are deleted or hidden
        const isExistNotReadyProduct = cartItems.some(
          (item) =>
            item.sku.product.deletedAt !== null ||
            item.sku.product.publishedAt === null ||
            item.sku.product.publishedAt > new Date()
        );
        if (isExistNotReadyProduct) {
          throw ProductNotFoundException;
        }

        // 4. Check if the skuIds in the cartItem sent belong to the shopid sent
        const cartItemMap = new Map<number, (typeof cartItems)[0]>();
        cartItems.forEach((item) => {
          cartItemMap.set(item.id, item);
        });
        const isValidShop = body.every((item) => {
          const bodyCartItemIds = item.cartItemIds;
          return bodyCartItemIds.every((cartItemId) => {
            const cartItem = cartItemMap.get(cartItemId)!;
            return item.shopId === cartItem.sku.createdById;
          });
        });
        if (!isValidShop) {
          throw SKUNotBelongToShopException;
        }

        // 5. Create order and delete cartItem in transaction to ensure data integrity
        const payment = await tx.payment.create({
          data: {
            status: PaymentStatus.PENDING,
          },
        });
        const orders: CreateOrderResType["orders"] = [];
        for (const item of body) {
          const order = await tx.order.create({
            data: {
              userId,
              status: OrderStatus.PENDING_PAYMENT,
              receiver: item.receiver,
              createdById: userId,
              shopId: item.shopId,
              paymentId: payment.id,
              items: {
                create: item.cartItemIds.map((cartItemId) => {
                  const cartItem = cartItemMap.get(cartItemId)!;
                  return {
                    productName: cartItem.sku.product.name,
                    skuPrice: cartItem.sku.price,
                    image: cartItem.sku.image,
                    skuId: cartItem.sku.id,
                    skuValue: cartItem.sku.value,
                    quantity: cartItem.quantity,
                    productId: cartItem.sku.product.id,
                    productTranslations: cartItem.sku.product.productTranslations.map((translation) => {
                      return {
                        id: translation.id,
                        name: translation.name,
                        description: translation.description,
                        languageId: translation.languageId,
                      };
                    }),
                  };
                }),
              },
              products: {
                connect: item.cartItemIds.map((cartItemId) => {
                  const cartItem = cartItemMap.get(cartItemId)!;
                  return {
                    id: cartItem.sku.product.id,
                  };
                }),
              },
            },
          });
          orders.push(order);
        }

        await tx.cartItem.deleteMany({
          where: {
            id: {
              in: allBodyCartItemIds,
            },
          },
        });
        for (const item of cartItems) {
          await tx.sKU
            .update({
              where: {
                id: item.sku.id,
                updatedAt: item.sku.updatedAt,
                stock: {
                  gte: item.quantity,
                },
              },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            })
            .catch((e) => {
              if (isNotFoundPrismaError(e)) {
                throw VersionConflictException;
              }
              throw e;
            });
        }
        await this.orderProducer.addCancelPaymentJob(payment.id);
        return [payment.id, orders];
      }
    );

    return {
      paymentId,
      orders,
    };
  }

  async detail(userId: number, orderid: number): Promise<GetOrderDetailResType> {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: orderid,
        userId,
        deletedAt: null,
      },
      include: {
        items: true,
      },
    });
    if (!order) {
      throw OrderNotFoundException;
    }
    return order;
  }

  async cancel(userId: number, orderId: number): Promise<CancelOrderResType> {
    try {
      const order = await this.prismaService.order.findUniqueOrThrow({
        where: {
          id: orderId,
          userId,
          deletedAt: null,
        },
      });
      if (order.status !== OrderStatus.PENDING_PAYMENT) {
        throw CannotCancelOrderException;
      }
      const updatedOrder = await this.prismaService.order.update({
        where: {
          id: orderId,
          userId,
          deletedAt: null,
        },
        data: {
          status: OrderStatus.CANCELLED,
          updatedById: userId,
        },
      });
      return updatedOrder;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw OrderNotFoundException;
      }
      throw error;
    }
  }
}
