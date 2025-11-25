import { z } from "zod";

export const presignedUploadFileBodySchema = z
  .object({
    filename: z.string({ error: "Error.InvalidFilename" }),
    filesize: z.number({ error: "Error.InvalidFilesize" }).max(5 * 1024 * 1024, { error: "Error.FilesizeTooLarge" }), // 5MB
  })
  .strict();

export const uploadFilesResSchema = z.object({
  data: z.array(
    z.object({
      url: z.string({ error: "Error.InvalidUrl" }),
    }),
    { error: "Error.InvalidFilesData" }
  ),
});

export const presignedUploadFileResSchema = z.object({
  presignedUrl: z.string({ error: "Error.InvalidPresignedUrl" }),
  url: z.string({ error: "Error.InvalidUrl" }),
});

export type PresignedUploadFileBodyType = z.infer<typeof presignedUploadFileBodySchema>;
