import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ZodResponse } from "nestjs-zod";
import {
  CreatePermissionBodyDto,
  GetPermissionDetailResDto,
  GetPermissionParamsDto,
  GetPermissionsQueryDto,
  GetPermissionsResDto,
  UpdatePermissionBodyDto,
} from "src/routes/permission/dto/permission.dto";
import { PermissionService } from "src/routes/permission/permission.service";
import { ActiveUser } from "src/shared/decorators/active-user.decorator";
import { MessageResDto } from "src/shared/dtos/response.dto";

@Controller("permissions")
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ZodResponse({ type: GetPermissionsResDto })
  list(@Query() query: GetPermissionsQueryDto) {
    return this.permissionService.list({
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(":permissionId")
  @ZodResponse({ type: GetPermissionDetailResDto })
  findById(@Param() params: GetPermissionParamsDto) {
    return this.permissionService.findById(params.permissionId);
  }

  @Post()
  @ZodResponse({ type: GetPermissionDetailResDto })
  create(@Body() body: CreatePermissionBodyDto, @ActiveUser("userId") userId: number) {
    return this.permissionService.create({
      data: body,
      createdById: userId,
    });
  }

  @Patch(":permissionId")
  @ZodResponse({ type: GetPermissionDetailResDto })
  update(
    @Body() body: UpdatePermissionBodyDto,
    @Param() params: GetPermissionParamsDto,
    @ActiveUser("userId") userId: number
  ) {
    return this.permissionService.update({
      data: body,
      id: params.permissionId,
      updatedById: userId,
    });
  }

  @Delete(":permissionId")
  @ZodResponse({ type: MessageResDto })
  delete(@Param() params: GetPermissionParamsDto, @ActiveUser("userId") userId: number) {
    return this.permissionService.delete({
      id: params.permissionId,
      deletedById: userId,
    });
  }
}
