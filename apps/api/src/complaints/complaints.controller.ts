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
import { ComplaintsService } from "./complaints.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { RequirePermissions } from "../common/decorators/permissions.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { AuditService } from "../audit/audit.service";

@Controller("complaints")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ComplaintsController {
  constructor(
    private complaintsService: ComplaintsService,
    private auditService: AuditService,
  ) {}

  @Get()
  @RequirePermissions("read:complaint")
  async findAll(@CurrentUser() user: any) {
    const complaints = await this.complaintsService.findAll(user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "READ_LIST",
      "Complaint",
    );
    return complaints;
  }

  @Get(":id")
  @RequirePermissions("read:complaint")
  async findOne(@Param("id") id: string, @CurrentUser() user: any) {
    const complaint = await this.complaintsService.findOne(id, user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "READ_DETAIL",
      "Complaint",
      { complaintId: id },
    );
    return complaint;
  }

  @Post()
  @RequirePermissions("write:complaint")
  async create(@Body() body: any, @CurrentUser() user: any) {
    const complaint = await this.complaintsService.create(body, user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "CREATE",
      "Complaint",
      { complaintId: complaint.id },
    );
    return complaint;
  }

  @Put(":id")
  @RequirePermissions("write:complaint")
  async update(@Param("id") id: string, @Body() body: any, @CurrentUser() user: any) {
    const complaint = await this.complaintsService.update(id, body, user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "UPDATE",
      "Complaint",
      { complaintId: complaint.id, updates: body },
    );
    return complaint;
  }

  @Delete(":id")
  @RequirePermissions("write:complaint")
  async remove(@Param("id") id: string, @CurrentUser() user: any) {
    const complaint = await this.complaintsService.remove(id, user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "DELETE",
      "Complaint",
      { complaintId: id },
    );
    return complaint;
  }
}
