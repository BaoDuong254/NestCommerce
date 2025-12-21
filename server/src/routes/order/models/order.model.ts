import { paginationQuerySchema } from "src/shared/models/request.model";
import { OrderSchema, OrderStatusSchema, ProductSKUSnapshotSchema } from "src/shared/models/shared-order.model";
import { z } from "zod";

export const GetOrderListResSchema = z.object({
  data: z.array(
    OrderSchema.extend({
      items: z.array(ProductSKUSnapshotSchema),
    }).omit({
      receiver: true,
      deletedAt: true,
      deletedById: true,
      createdById: true,
      updatedById: true,
    })
  ),
  totalItems: z.number({ error: "Error.InvalidTotalItems" }),
  page: z.number({ error: "Error.InvalidPage" }),
  limit: z.number({ error: "Error.InvalidLimit" }),
  totalPages: z.number({ error: "Error.InvalidTotalPages" }),
});

export const GetOrderListQuerySchema = paginationQuerySchema.extend({
  status: OrderStatusSchema.optional(),
});

export const GetOrderDetailResSchema = OrderSchema.extend({
  items: z.array(ProductSKUSnapshotSchema),
});

export const CreateOrderBodySchema = z
  .array(
    z.object({
      shopId: z.number({ error: "Error.InvalidShopId" }),
      receiver: z.object({
        name: z.string({ error: "Error.InvalidReceiverName" }),
        phone: z.string({ error: "Error.InvalidReceiverPhone" }).min(9).max(20),
        address: z.string({ error: "Error.InvalidReceiverAddress" }),
      }),
      cartItemIds: z.array(z.number({ error: "Error.InvalidCartItemId" })).min(1),
    })
  )
  .min(1);

export const CreateOrderResSchema = z.object({
  orders: z.array(OrderSchema),
  paymentId: z.number({ error: "Error.InvalidPaymentId" }),
});
export const CancelOrderBodySchema = z.object({});
export const CancelOrderResSchema = OrderSchema;

export const GetOrderParamsSchema = z
  .object({
    orderId: z.coerce
      .number({ error: "InvalidOrderId" })
      .int({ error: "OrderIdMustBeInteger" })
      .positive({ error: "OrderIdMustBePositive" }),
  })
  .strict();

export type GetOrderListResType = z.infer<typeof GetOrderListResSchema>;
export type GetOrderListQueryType = z.infer<typeof GetOrderListQuerySchema>;
export type GetOrderDetailResType = z.infer<typeof GetOrderDetailResSchema>;
export type GetOrderParamsType = z.infer<typeof GetOrderParamsSchema>;
export type CreateOrderBodyType = z.infer<typeof CreateOrderBodySchema>;
export type CreateOrderResType = z.infer<typeof CreateOrderResSchema>;
export type CancelOrderResType = z.infer<typeof CancelOrderResSchema>;
