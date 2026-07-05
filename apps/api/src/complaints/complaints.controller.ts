import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ComplaintsService } from "./complaints.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { RequirePermissions } from "../common/decorators/permissions.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("complaints")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ComplaintsController {
  @Put(":id")
  @RequirePermissions("write:complaint")
  update(@Param("id") id: string, @Body() body: any, @CurrentUser() user: any) {
    return this.complaintsService.update(id, body, user.tenantId);
  }
  constructor(private complaintsService: ComplaintsService) {}

  @Get()
  @RequirePermissions("read:complaint")
  findAll(@CurrentUser() user: any) {
    return this.complaintsService.findAll(user.tenantId);
  }

  @Get(":id")
  @RequirePermissions("read:complaint")
  findOne(@Param("id") id: string, @CurrentUser() user: any) {
    return this.complaintsService.findOne(id, user.tenantId);
  }

  @Post()
  @RequirePermissions("write:complaint")
  create(@Body() body: any, @CurrentUser() user: any) {
    return this.complaintsService.create(body, user.tenantId);
  }
}
