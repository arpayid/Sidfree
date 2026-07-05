import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { FamiliesService } from "./families.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { RequirePermissions } from "../common/decorators/permissions.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { AuditService } from "../audit/audit.service";

@Controller("families")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FamiliesController {
  constructor(
    private familiesService: FamiliesService,
    private auditService: AuditService,
  ) {}

  @Get()
  @RequirePermissions("read:resident")
  async findAll(@CurrentUser() user: any) {
    const families = await this.familiesService.findAll(user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "READ_LIST",
      "Family",
    );
    return families.map((f) => ({
      ...f,
      kkNumber:
        f.kkNumber && f.kkNumber.length >= 8
          ? f.kkNumber.replace(/(.{4}).*(.{4})/, "$1********$2")
          : f.kkNumber,
    }));
  }

  @Get(":id")
  @RequirePermissions("read:resident")
  async findOne(@Param("id") id: string, @CurrentUser() user: any) {
    const family = await this.familiesService.findOne(id, user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "READ_DETAIL",
      "Family",
      { familyId: id },
    );
    return family;
  }

  @Post()
  @RequirePermissions("write:resident")
  async create(@Body() body: any, @CurrentUser() user: any) {
    const family = await this.familiesService.create(body, user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "CREATE",
      "Family",
      { familyId: family.id },
    );
    return family;
  }

  @Put(":id")
  @RequirePermissions("write:resident")
  async update(@Param("id") id: string, @Body() body: any, @CurrentUser() user: any) {
    const family = await this.familiesService.update(id, body, user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "UPDATE",
      "Family",
      { familyId: family.id, updates: body },
    );
    return family;
  }

  @Delete(":id")
  @RequirePermissions("write:resident")
  async remove(@Param("id") id: string, @CurrentUser() user: any) {
    const family = await this.familiesService.remove(id, user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "DELETE",
      "Family",
      { familyId: id },
    );
    return family;
  }
}
