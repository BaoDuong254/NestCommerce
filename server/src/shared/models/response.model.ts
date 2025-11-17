import z from "zod";

export const MessageResSchema = z.object({
  message: z.string({ error: "Error.InvalidMessage" }),
});

export type MessageResType = z.infer<typeof MessageResSchema>;
