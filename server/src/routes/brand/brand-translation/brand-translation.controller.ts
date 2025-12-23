import { Body, Controller, Delete, Get, Param, Post, Patch } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { BrandTranslationService } from "src/routes/brand/brand-translation/brand-translation.service";
import {
  CreateBrandTranslationBodyDto,
  GetBrandTranslationDetailResDto,
  GetBrandTranslationParamsDto,
  UpdateBrandTranslationBodyDto,
} from "src/routes/brand/brand-translation/dto/brand-translation.dto";
import { ActiveUser } from "src/shared/decorators/active-user.decorator";
import { MessageResDto } from "src/shared/dtos/response.dto";

@Controller("brand-translations")
@ApiBearerAuth()
export class BrandTranslationController {
  constructor(private readonly brandTranslationService: BrandTranslationService) {}

  @Get(":brandTranslationId")
  @ZodResponse({ type: GetBrandTranslationDetailResDto })
  findById(@Param() params: GetBrandTranslationParamsDto) {
    return this.brandTranslationService.findById(params.brandTranslationId);
  }

  @Post()
  @ZodResponse({ type: GetBrandTranslationDetailResDto })
  create(@Body() body: CreateBrandTranslationBodyDto, @ActiveUser("userId") userId: number) {
    return this.brandTranslationService.create({
      data: body,
      createdById: userId,
    });
  }

  @Patch(":brandTranslationId")
  @ZodResponse({ type: GetBrandTranslationDetailResDto })
  update(
    @Body() body: UpdateBrandTranslationBodyDto,
    @Param() params: GetBrandTranslationParamsDto,
    @ActiveUser("userId") userId: number
  ) {
    return this.brandTranslationService.update({
      data: body,
      id: params.brandTranslationId,
      updatedById: userId,
    });
  }

  @Delete(":brandTranslationId")
  @ZodResponse({ type: MessageResDto })
  delete(@Param() params: GetBrandTranslationParamsDto, @ActiveUser("userId") userId: number) {
    return this.brandTranslationService.delete({
      id: params.brandTranslationId,
      deletedById: userId,
    });
  }
}
