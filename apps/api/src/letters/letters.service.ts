import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LettersService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.letter.findMany({
      where: { tenantId },
      include: { resident: true },
    });
  }

  async findOne(id: string, tenantId: string) {
    const letter = await this.prisma.letter.findFirst({
      where: { id, tenantId },
      include: { resident: true },
    });
    if (!letter) throw new NotFoundException("Letter not found");
    return letter;
  }

  async create(data: any, tenantId: string) {
    return this.prisma.letter.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async update(id: string, data: any, tenantId: string) {
    await this.findOne(id, tenantId);
    return this.prisma.letter.update({
      where: { id },
      data,
    });
  }
}
