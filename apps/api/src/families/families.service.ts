import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FamiliesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.family.findMany({
      where: { tenantId },
      include: { residents: true },
    });
  }

  async findOne(id: string, tenantId: string) {
    const family = await this.prisma.family.findFirst({
      where: { id, tenantId },
      include: { residents: true },
    });
    if (!family) throw new NotFoundException("Family not found");
    return family;
  }

  async create(data: any, tenantId: string) {
    return this.prisma.family.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async update(id: string, data: any, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.family.update({
      where: { id },
      data,
    });
  }
}
