import { Body, Controller, Delete, Get, Param, Post, Patch, Query } from "@nestjs/common";
import { ZodResponse } from "nestjs-zod";
import { CategoryService } from "src/routes/category/category.service";
import {
  CreateCategoryBodyDto,
  GetAllCategoriesQueryDto,
  GetAllCategoriesResDto,
  GetCategoryDetailResDto,
  GetCategoryParamsDto,
  UpdateCategoryBodyDto,
} from "src/routes/category/dto/category.dto";
import { ActiveUser } from "src/shared/decorators/active-user.decorator";
import { IsPublic } from "src/shared/decorators/auth.decorator";
import { MessageResDto } from "src/shared/dtos/response.dto";

@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @IsPublic()
  @ZodResponse({ type: GetAllCategoriesResDto })
  findAll(@Query() query: GetAllCategoriesQueryDto) {
    return this.categoryService.findAll(query.parentCategoryId);
  }

  @Get(":categoryId")
  @IsPublic()
  @ZodResponse({ type: GetCategoryDetailResDto })
  findById(@Param() params: GetCategoryParamsDto) {
    return this.categoryService.findById(params.categoryId);
  }

  @Post()
  @ZodResponse({ type: GetCategoryDetailResDto })
  create(@Body() body: CreateCategoryBodyDto, @ActiveUser("userId") userId: number) {
    return this.categoryService.create({
      data: body,
      createdById: userId,
    });
  }

  @Patch(":categoryId")
  @ZodResponse({ type: GetCategoryDetailResDto })
  update(
    @Body() body: UpdateCategoryBodyDto,
    @Param() params: GetCategoryParamsDto,
    @ActiveUser("userId") userId: number
  ) {
    return this.categoryService.update({
      data: body,
      id: params.categoryId,
      updatedById: userId,
    });
  }

  @Delete(":categoryId")
  @ZodResponse({ type: MessageResDto })
  delete(@Param() params: GetCategoryParamsDto, @ActiveUser("userId") userId: number) {
    return this.categoryService.delete({
      id: params.categoryId,
      deletedById: userId,
    });
  }
}
