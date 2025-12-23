import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { ZodResponse } from "nestjs-zod";
import path from "path";
import {
  PresignedUploadFileBodyDto,
  PresignedUploadFileResDto,
  UploadFilesResDto,
} from "src/routes/media/dto/media.dto";
import { MediaService } from "src/routes/media/media.service";
import { ParseFilePipeWithUnlink } from "src/routes/media/parse-file-pipe-with-unlink.pipe";
import { UPLOAD_DIR } from "src/shared/constants/other.constant";
import { IsPublic } from "src/shared/decorators/auth.decorator";

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}
  @Post("images/upload")
  @ZodResponse({ type: UploadFilesResDto })
  @UseInterceptors(
    FilesInterceptor("files", 100, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    })
  )
  uploadFile(
    @UploadedFiles(
      new ParseFilePipeWithUnlink({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      })
    )
    files: Array<Express.Multer.File>
  ) {
    return this.mediaService.uploadFile(files);
  }

  @Get("static/:filename")
  @IsPublic()
  serveFile(@Param("filename") filename: string, @Res() res: Response) {
    return res.sendFile(path.resolve(UPLOAD_DIR, filename), (error) => {
      if (error) {
        const notfound = new NotFoundException("Error.FileNotFound");
        res.status(notfound.getStatus()).json(notfound.getResponse());
      }
    });
  }

  @Post("images/upload/presigned-url")
  @ZodResponse({ type: PresignedUploadFileResDto })
  @IsPublic()
  async createPresignedUrl(@Body() body: PresignedUploadFileBodyDto) {
    return this.mediaService.getPresignedUrl(body);
  }
}
