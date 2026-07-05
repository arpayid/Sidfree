import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ComplaintsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.complaint.findMany({
      where: { tenantId },
      include: { resident: true },
    });
  }

  async findOne(id: string, tenantId: string) {
    const complaint = await this.prisma.complaint.findFirst({
      where: { id, tenantId },
      include: { resident: true },
    });
    if (!complaint) throw new NotFoundException("Complaint not found");
    return complaint;
  }

  async create(data: any, tenantId: string) {
    return this.prisma.complaint.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async update(id: string, data: any, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.complaint.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.complaint.delete({
      where: { id },
    });
  }
}
