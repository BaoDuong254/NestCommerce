import { z } from "zod";

export const emptyBodySchema = z.object({}).strict();

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});

export type EmptyBodyType = z.infer<typeof emptyBodySchema>;
export type PaginationQueryType = z.infer<typeof paginationQuerySchema>;
