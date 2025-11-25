import { createZodDto } from "nestjs-zod";
import {
  presignedUploadFileBodySchema,
  presignedUploadFileResSchema,
  uploadFilesResSchema,
} from "src/routes/media/models/media.model";

export class PresignedUploadFileBodyDto extends createZodDto(presignedUploadFileBodySchema) {}
export class UploadFilesResDto extends createZodDto(uploadFilesResSchema) {}
export class PresignedUploadFileResDto extends createZodDto(presignedUploadFileResSchema) {}
