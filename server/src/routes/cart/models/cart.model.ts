import { ProductTranslationSchema } from "src/shared/models/shared-product-translation.model";
import { ProductSchema } from "src/shared/models/shared-product.model";
import { SKUSchema } from "src/shared/models/shared-sku.model";
import { userSchema } from "src/shared/models/shared-user.model";
import { z } from "zod";

export const CartItemSchema = z.object({
  id: z.number({ error: "Error.InvalidCartItemId" }),
  quantity: z.number({ error: "Error.InvalidQuantity" }).int().positive(),
  skuId: z.number({ error: "Error.InvalidSkuId" }),
  userId: z.number({ error: "Error.InvalidUserId" }),

  createdAt: z.coerce.date({ error: "Error.InvalidCreatedAt" }),
  updatedAt: z.coerce.date({ error: "Error.InvalidUpdatedAt" }),
});

export const GetCartItemParamsSchema = z.object({
  cartItemId: z.coerce.number().int().positive(),
});

export const CartItemDetailSchema = z.object({
  shop: userSchema.pick({
    id: true,
    name: true,
    avatar: true,
  }),
  cartItems: z.array(
    CartItemSchema.extend({
      sku: SKUSchema.extend({
        product: ProductSchema.extend({
          productTranslations: z.array(
            ProductTranslationSchema.omit({
              createdById: true,
              updatedById: true,
              deletedById: true,
              deletedAt: true,
              createdAt: true,
              updatedAt: true,
            })
          ),
        }).omit({
          createdById: true,
          updatedById: true,
          deletedById: true,
          deletedAt: true,
          createdAt: true,
          updatedAt: true,
        }),
      }).omit({
        createdById: true,
        updatedById: true,
        deletedById: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      }),
    })
  ),
});

export const GetCartResSchema = z.object({
  data: z.array(CartItemDetailSchema),
  totalItems: z.number({ error: "Error.InvalidTotalItems" }),
  page: z.number({ error: "Error.InvalidPage" }),
  limit: z.number({ error: "Error.InvalidLimit" }),
  totalPages: z.number({ error: "Error.InvalidTotalPages" }),
});

export const AddToCartBodySchema = CartItemSchema.pick({
  skuId: true,
  quantity: true,
}).strict();

export const UpdateCartItemBodySchema = AddToCartBodySchema;

export const DeleteCartBodySchema = z
  .object({
    cartItemIds: z.array(
      z
        .number({ error: "Error.InvalidCartItemId" })
        .int({ error: "Error.InvalidCartItemId" })
        .positive({ error: "Error.InvalidCartItemId" })
    ),
  })
  .strict();

export type CartItemType = z.infer<typeof CartItemSchema>;
export type GetCartItemParamType = z.infer<typeof GetCartItemParamsSchema>;
export type CartItemDetailType = z.infer<typeof CartItemDetailSchema>;
export type GetCartResType = z.infer<typeof GetCartResSchema>;
export type AddToCartBodyType = z.infer<typeof AddToCartBodySchema>;
export type UpdateCartItemBodyType = z.infer<typeof UpdateCartItemBodySchema>;
export type DeleteCartBodyType = z.infer<typeof DeleteCartBodySchema>;
