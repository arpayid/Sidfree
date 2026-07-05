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
import { ResidentsService } from "./residents.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { RequirePermissions } from "../common/decorators/permissions.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { AuditService } from "../audit/audit.service";

@Controller("residents")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ResidentsController {
  constructor(
    private residentsService: ResidentsService,
    private auditService: AuditService,
  ) {}

  @Get()
  @RequirePermissions("read:resident")
  async findAll(@CurrentUser() user: any) {
    const residents = await this.residentsService.findAll(user.tenantId);

    // Audit Log for accessing list
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "READ_LIST",
      "Resident",
    );

    // Masking data
    return residents.map((r) => ({
      ...r,
      nik:
        r.nik && r.nik.length >= 8
          ? r.nik.replace(/(.{4}).*(.{4})/, "$1********$2")
          : r.nik,
      family: r.family
        ? {
            ...r.family,
            kkNumber:
              r.family.kkNumber && r.family.kkNumber.length >= 8
                ? r.family.kkNumber.replace(/(.{4}).*(.{4})/, "$1********$2")
                : r.family.kkNumber,
          }
        : null,
    }));
  }

  @Get(":id")
  @RequirePermissions("read:resident")
  async findOne(@Param("id") id: string, @CurrentUser() user: any) {
    const resident = await this.residentsService.findOne(id, user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "READ_DETAIL",
      "Resident",
      { residentId: id },
    );
    return resident; // unmasked in detail
  }

  @Post()
  @RequirePermissions("write:resident")
  async create(@Body() body: any, @CurrentUser() user: any) {
    const resident = await this.residentsService.create(body, user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "CREATE",
      "Resident",
      { residentId: resident.id },
    );
    return resident;
  }

  @Put(":id")
  @RequirePermissions("write:resident")
  async update(
    @Param("id") id: string,
    @Body() body: any,
    @CurrentUser() user: any,
  ) {
    const resident = await this.residentsService.update(
      id,
      body,
      user.tenantId,
    );
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "UPDATE",
      "Resident",
      { residentId: resident.id, updates: body },
    );
    return resident;
  }
}
