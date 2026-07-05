import { Controller, Get, Put, Body, UseGuards } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("tenant")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getSettings(@CurrentUser() user: any) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: user.tenantId }
    });
    return tenant;
  }

  @Put()
  @Roles("Super Admin", "Admin Desa")
  async updateSettings(@Body() body: any, @CurrentUser() user: any) {
    const tenant = await this.prisma.tenant.update({
      where: { id: user.tenantId },
      data: { name: body.name }
    });
    return tenant;
  }
}
