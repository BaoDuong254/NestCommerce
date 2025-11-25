import { ParseFileOptions, ParseFilePipe } from "@nestjs/common";
import { unlink } from "fs/promises";

export class ParseFilePipeWithUnlink extends ParseFilePipe {
  constructor(options?: ParseFileOptions) {
    super(options);
  }

  async transform(files: Array<Express.Multer.File>): Promise<Express.Multer.File | Express.Multer.File[]> {
    try {
      const result = (await super.transform(files)) as Express.Multer.File | Express.Multer.File[];
      return result;
    } catch (error) {
      await Promise.all(files.map((file) => unlink(file.path)));
      throw error;
    }
  }
}
