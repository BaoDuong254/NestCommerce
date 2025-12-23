import { Body, Controller, Delete, Get, Param, Post, Patch, Query } from "@nestjs/common";
import { ZodResponse } from "nestjs-zod";
import { BrandService } from "src/routes/brand/brand.service";
import {
  CreateBrandBodyDto,
  GetBrandDetailResDto,
  GetBrandParamsDto,
  GetBrandsResDto,
  UpdateBrandBodyDto,
} from "src/routes/brand/dto/brand.dto";
import { ActiveUser } from "src/shared/decorators/active-user.decorator";
import { IsPublic } from "src/shared/decorators/auth.decorator";
import { PaginationQueryDto } from "src/shared/dtos/request.dto";
import { MessageResDto } from "src/shared/dtos/response.dto";

@Controller("brands")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @IsPublic()
  @ZodResponse({ type: GetBrandsResDto })
  list(@Query() query: PaginationQueryDto) {
    return this.brandService.list(query);
  }

  @Get(":brandId")
  @IsPublic()
  @ZodResponse({ type: GetBrandDetailResDto })
  findById(@Param() params: GetBrandParamsDto) {
    return this.brandService.findById(params.brandId);
  }

  @Post()
  @ZodResponse({ type: GetBrandDetailResDto })
  create(@Body() body: CreateBrandBodyDto, @ActiveUser("userId") userId: number) {
    return this.brandService.create({
      data: body,
      createdById: userId,
    });
  }

  @Patch(":brandId")
  @ZodResponse({ type: GetBrandDetailResDto })
  update(@Body() body: UpdateBrandBodyDto, @Param() params: GetBrandParamsDto, @ActiveUser("userId") userId: number) {
    return this.brandService.update({
      data: body,
      id: params.brandId,
      updatedById: userId,
    });
  }

  @Delete(":brandId")
  @ZodResponse({ type: MessageResDto })
  delete(@Param() params: GetBrandParamsDto, @ActiveUser("userId") userId: number) {
    return this.brandService.delete({
      id: params.brandId,
      deletedById: userId,
    });
  }
}
