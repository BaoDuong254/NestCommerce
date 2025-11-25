import { Injectable } from "@nestjs/common";
import { S3Service } from "src/shared/services/s3.service";
import { unlink } from "fs/promises";
import { generateRandomFilename } from "src/shared/helpers";
import { PresignedUploadFileBodyType } from "src/routes/media/models/media.model";

@Injectable()
export class MediaService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadFile(files: Array<Express.Multer.File>) {
    const result = await Promise.all(
      files.map(async (file) => {
        const res = await this.s3Service.uploadedFile({
          filename: "images/" + file.filename,
          filepath: file.path,
          contentType: file.mimetype,
        });
        return { url: String(res.Location) };
      })
    );

    // Clean up local files when upload to S3 is done
    await Promise.all(
      files.map((file) => {
        return unlink(file.path);
      })
    );

    return {
      data: result,
    };
  }

  async getPresignedUrl(body: PresignedUploadFileBodyType) {
    const randomFilename = generateRandomFilename(body.filename);
    const presignedUrl = await this.s3Service.createPresignedUrlWithClient(randomFilename);
    const url = presignedUrl.split("?")[0];
    return {
      presignedUrl,
      url,
    };
  }
}
