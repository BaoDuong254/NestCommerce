import { Body, Controller, Delete, Get, Param, Post, Patch } from "@nestjs/common";
import { ZodSerializerDto } from "nestjs-zod";
import {
  CreateLanguageBodyDto,
  GetLanguageDetailResDto,
  GetLanguageParamsDto,
  GetLanguagesResDto,
  UpdateLanguageBodyDto,
} from "src/routes/language/dto/language.dto";
import { LanguageService } from "src/routes/language/language.service";
import { ActiveUser } from "src/shared/decorators/active-user.decorator";
import { MessageResDto } from "src/shared/dtos/response.dto";

@Controller("languages")
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  @ZodSerializerDto(GetLanguagesResDto)
  async findAll() {
    return await this.languageService.findAll();
  }

  @Get(":languageId")
  @ZodSerializerDto(GetLanguageDetailResDto)
  async findById(@Param() params: GetLanguageParamsDto) {
    return await this.languageService.findById(params.languageId);
  }

  @Post()
  @ZodSerializerDto(GetLanguageDetailResDto)
  async create(@Body() body: CreateLanguageBodyDto, @ActiveUser("userId") userId: number) {
    return await this.languageService.create({
      data: body,
      createdById: userId,
    });
  }

  @Patch(":languageId")
  @ZodSerializerDto(GetLanguageDetailResDto)
  update(
    @Body() body: UpdateLanguageBodyDto,
    @Param() params: GetLanguageParamsDto,
    @ActiveUser("userId") userId: number
  ) {
    return this.languageService.update({
      data: body,
      id: params.languageId,
      updatedById: userId,
    });
  }

  @Delete(":languageId")
  @ZodSerializerDto(MessageResDto)
  delete(@Param() params: GetLanguageParamsDto) {
    return this.languageService.delete(params.languageId);
  }
}
