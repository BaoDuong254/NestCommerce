import { Body, Controller, Delete, Get, Param, Post, Patch } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
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
@ApiBearerAuth()
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  @ZodResponse({ type: GetLanguagesResDto })
  async findAll() {
    return await this.languageService.findAll();
  }

  @Get(":languageId")
  @ZodResponse({ type: GetLanguageDetailResDto })
  async findById(@Param() params: GetLanguageParamsDto) {
    return await this.languageService.findById(params.languageId);
  }

  @Post()
  @ZodResponse({ type: GetLanguageDetailResDto })
  async create(@Body() body: CreateLanguageBodyDto, @ActiveUser("userId") userId: number) {
    return await this.languageService.create({
      data: body,
      createdById: userId,
    });
  }

  @Patch(":languageId")
  @ZodResponse({ type: GetLanguageDetailResDto })
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
  @ZodResponse({ type: MessageResDto })
  delete(@Param() params: GetLanguageParamsDto) {
    return this.languageService.delete(params.languageId);
  }
}
