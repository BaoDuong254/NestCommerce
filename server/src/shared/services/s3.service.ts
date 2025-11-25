import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import envConfig from "src/shared/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { contentType as mimeContentType } from "mime-types";

@Injectable()
export class S3Service {
  private s3: S3;
  constructor() {
    this.s3 = new S3({
      // endpoint: envConfig.S3_ENPOINT, // Uncomment this line if using another service like DigitalOcean Spaces
      region: envConfig.S3_REGION,
      credentials: {
        secretAccessKey: envConfig.S3_SECRET_KEY,
        accessKeyId: envConfig.S3_ACCESS_KEY,
      },
    });
    // Set bucket CORS and Policy if needed. If using AWS S3 with proper settings, you might not need this.
    // void this.s3.putBucketCors({
    //   Bucket: envConfig.S3_BUCKET_NAME,
    //   CORSConfiguration: {
    //     CORSRules: [
    //       {
    //         AllowedHeaders: ["*"],
    //         AllowedMethods: ["GET", "PUT"],
    //         AllowedOrigins: ["*"],
    //         ExposeHeaders: [],
    //       },
    //     ],
    //   },
    // });
    // void this.s3.putBucketPolicy({
    //   Bucket: envConfig.S3_BUCKET_NAME,
    //   Policy: JSON.stringify({
    //     Version: "2012-10-17",
    //     Statement: [
    //       {
    //         Sid: "PublicReadGetObject",
    //         Effect: "Allow",
    //         Principal: "*",
    //         Action: "s3:GetObject",
    //         Resource: `arn:aws:s3:::${envConfig.S3_BUCKET_NAME}/*`,
    //       },
    //     ],
    //   }),
    // });
  }

  uploadedFile({ filename, filepath, contentType }: { filename: string; filepath: string; contentType: string }) {
    const parallelUploads3 = new Upload({
      client: this.s3,
      params: {
        Bucket: envConfig.S3_BUCKET_NAME,
        Key: filename,
        Body: readFileSync(filepath),
        ContentType: contentType,
      },
      tags: [],
      queueSize: 4,
      partSize: 1024 * 1024 * 5,
      leavePartsOnError: false,
    });
    return parallelUploads3.done();
  }

  createPresignedUrlWithClient(filename: string) {
    const lookup = mimeContentType(filename);
    const contentType = typeof lookup === "string" ? lookup : "application/octet-stream";
    const command = new PutObjectCommand({ Bucket: envConfig.S3_BUCKET_NAME, Key: filename, ContentType: contentType });
    return getSignedUrl(this.s3, command, { expiresIn: 100 });
  }
}
