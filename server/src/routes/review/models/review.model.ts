import { MediaType } from "src/shared/constants/media.constant";
import { userSchema } from "src/shared/models/shared-user.model";
import { z } from "zod";

export const ReviewMediaSchema = z.object({
  id: z.number({ error: "Error.InvalidID" }).int({ error: "Error.InvalidID" }),
  url: z.url({ error: "Error.InvalidURL" }),
  type: z.enum([MediaType.IMAGE, MediaType.VIDEO]),
  reviewId: z.number({ error: "Error.InvalidReviewID" }).int({ error: "Error.InvalidReviewID" }),
  createdAt: z.iso.datetime({ error: "Error.InvalidDate" }),
});

export const ReviewSchema = z.object({
  id: z.number({ message: "Error.InvalidID" }).int({ message: "Error.InvalidID" }),
  content: z.string({ message: "Error.InvalidContent" }),
  rating: z
    .number({ message: "Error.InvalidRating" })
    .int({ message: "Error.InvalidRating" })
    .min(0, { message: "Error.RatingTooLow" })
    .max(5, { message: "Error.RatingTooHigh" }),
  orderId: z.number({ message: "Error.InvalidOrderID" }).int({ message: "Error.InvalidOrderID" }),
  productId: z.number({ message: "Error.InvalidProductID" }).int({ message: "Error.InvalidProductID" }),
  userId: z.number({ message: "Error.InvalidUserID" }).int({ message: "Error.InvalidUserID" }),
  updateCount: z.number({ message: "Error.InvalidUpdateCount" }).int({ message: "Error.InvalidUpdateCount" }),
  createdAt: z.iso.datetime({ message: "Error.InvalidDate" }),
  updatedAt: z.iso.datetime({ message: "Error.InvalidDate" }),
});

export const CreateReviewBodySchema = ReviewSchema.pick({
  content: true,
  rating: true,
  productId: true,
  orderId: true,
}).extend({
  medias: z.array(
    ReviewMediaSchema.pick({
      url: true,
      type: true,
    }),
    { message: "Error.InvalidMediaArray" }
  ),
});

export const CreateReviewResSchema = ReviewSchema.extend({
  medias: z.array(ReviewMediaSchema),
  user: userSchema.pick({
    id: true,
    name: true,
    avatar: true,
  }),
});

export const UpdateReviewResSchema = CreateReviewResSchema;

export const GetReviewsSchema = z.object({
  data: z.array(CreateReviewResSchema, { message: "Error.InvalidDataArray" }),
  totalItems: z.number({ message: "Error.InvalidTotalItems" }),
  page: z.number({ message: "Error.InvalidPage" }),
  limit: z.number({ message: "Error.InvalidLimit" }),
  totalPages: z.number({ message: "Error.InvalidTotalPages" }),
});

export const UpdateReviewBodySchema = CreateReviewBodySchema;
export const GetReviewsParamsSchema = z.object({
  productId: z.coerce
    .number({ message: "Error.InvalidProductID" })
    .int({ message: "Error.InvalidProductID" })
    .positive({ message: "Error.ProductIDMustBePositive" }),
});

export const GetReviewDetailParamsSchema = z.object({
  reviewId: z.coerce
    .number({ message: "Error.InvalidReviewID" })
    .int({ message: "Error.InvalidReviewID" })
    .positive({ message: "Error.ReviewIDMustBePositive" }),
});

export type ReviewType = z.infer<typeof ReviewSchema>;
export type ReviewMediaType = z.infer<typeof ReviewMediaSchema>;
export type CreateReviewBodyType = z.infer<typeof CreateReviewBodySchema>;
export type UpdateReviewBodyType = z.infer<typeof UpdateReviewBodySchema>;
export type CreateReviewResType = z.infer<typeof CreateReviewResSchema>;
export type UpdateReviewResType = z.infer<typeof UpdateReviewResSchema>;
export type GetReviewsType = z.infer<typeof GetReviewsSchema>;
