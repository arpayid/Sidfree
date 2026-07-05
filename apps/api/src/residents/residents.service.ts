import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ResidentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.resident.findMany({
      where: { tenantId },
      include: { family: true },
    });
  }

  async findOne(id: string, tenantId: string) {
    const resident = await this.prisma.resident.findFirst({
      where: { id, tenantId },
      include: { family: true },
    });
    if (!resident) throw new NotFoundException("Resident not found");
    return resident;
  }

  async create(data: any, tenantId: string) {
    return this.prisma.resident.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async update(id: string, data: any, tenantId: string) {
    await this.findOne(id, tenantId); // ensure it exists in tenant
    return this.prisma.resident.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.resident.delete({
      where: { id },
    });
  }
}
