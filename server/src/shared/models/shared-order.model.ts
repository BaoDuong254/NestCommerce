import { OrderStatus } from "src/shared/constants/order.constant";
import { z } from "zod";

export const OrderStatusSchema = z.enum([
  OrderStatus.PENDING_PAYMENT,
  OrderStatus.PENDING_PICKUP,
  OrderStatus.PENDING_DELIVERY,
  OrderStatus.DELIVERED,
  OrderStatus.RETURNED,
  OrderStatus.CANCELLED,
]);

export const OrderSchema = z.object({
  id: z.number({ error: "Error.InvalidOrderId" }),
  userId: z.number({ error: "Error.InvalidUserId" }),
  status: OrderStatusSchema,
  receiver: z.object({
    name: z.string({ error: "Error.InvalidReceiverName" }),
    phone: z.string({ error: "Error.InvalidReceiverPhone" }),
    address: z.string({ error: "Error.InvalidReceiverAddress" }),
  }),
  shopId: z.number({ error: "Error.InvalidShopId" }).nullable(),
  paymentId: z.number({ error: "Error.InvalidPaymentId" }),
  createdById: z.number({ error: "Error.InvalidCreatedByID" }).nullable(),
  updatedById: z.number({ error: "Error.InvalidUpdatedByID" }).nullable(),
  deletedById: z.number({ error: "Error.InvalidDeletedByID" }).nullable(),
  deletedAt: z.iso.datetime({ error: "Error.InvalidDeletedAt" }).nullable(),
  createdAt: z.iso.datetime({ error: "Error.InvalidCreatedAt" }),
  updatedAt: z.iso.datetime({ error: "Error.InvalidUpdatedAt" }),
});

export const ProductSKUSnapshotSchema = z.object({
  id: z.number({ error: "Error.InvalidProductSKUSnapshotId" }),
  productId: z.number({ error: "Error.InvalidProductId" }).nullable(),
  productName: z.string({ error: "Error.InvalidProductName" }),
  productTranslations: z.array(
    z.object({
      id: z.number({ error: "Error.InvalidProductTranslationId" }),
      name: z.string({ error: "Error.InvalidProductTranslationName" }),
      description: z.string({ error: "Error.InvalidProductTranslationDescription" }),
      languageId: z.string({ error: "Error.InvalidLanguageId" }),
    })
  ),
  skuPrice: z.number({ error: "Error.InvalidSkuPrice" }),
  image: z.string({ error: "Error.InvalidImage" }),
  skuValue: z.string({ error: "Error.InvalidSkuValue" }),
  skuId: z.number({ error: "Error.InvalidSkuId" }).nullable(),
  orderId: z.number({ error: "Error.InvalidOrderId" }).nullable(),
  quantity: z.number({ error: "Error.InvalidQuantity" }),

  createdAt: z.iso.datetime({ error: "Error.InvalidCreatedAt" }),
});

export const OrderIncludeProductSKUSnapshotSchema = OrderSchema.extend({
  items: z.array(ProductSKUSnapshotSchema),
});

export type OrderType = z.infer<typeof OrderSchema>;
export type OrderIncludeProductSKUSnapshotType = z.infer<typeof OrderIncludeProductSKUSnapshotSchema>;
