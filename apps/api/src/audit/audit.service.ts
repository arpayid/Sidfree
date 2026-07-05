import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(
    tenantId: string,
    userId: string,
    action: string,
    resource: string,
    details?: any,
  ) {
    if (!tenantId) return; // Super admin actions might not have tenantId, handle accordingly

    await this.prisma.auditLog.create({
      data: {
        tenantId,
        userId,
        action,
        resource,
        details: details ? details : {},
      },
    });
  }
}
