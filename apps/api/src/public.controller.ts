import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

@Controller("public")
export class PublicController {
  constructor(private prisma: PrismaService) {}

  @Post("complaints")
  async submitComplaint(@Body() body: any) {
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant)
      throw new HttpException("Tenant not found", HttpStatus.NOT_FOUND);

    let residentId = null;
    if (body.nik) {
      const resident = await this.prisma.resident.findFirst({
        where: { nik: body.nik, tenantId: tenant.id },
      });
      if (resident) residentId = resident.id;
    }

    return this.prisma.complaint.create({
      data: {
        title: body.title,
        content: body.content,
        tenantId: tenant.id,
        residentId,
      },
    });
  }

  @Post("letters")
  async submitLetter(@Body() body: any) {
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant)
      throw new HttpException("Tenant not found", HttpStatus.NOT_FOUND);

    if (!body.nik) {
      throw new HttpException(
        "NIK diperlukan untuk pengajuan surat",
        HttpStatus.BAD_REQUEST,
      );
    }

    const resident = await this.prisma.resident.findFirst({
      where: { nik: body.nik, tenantId: tenant.id },
    });
    if (!resident) {
      throw new HttpException(
        "NIK tidak terdaftar sebagai warga",
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.letter.create({
      data: {
        type: body.type,
        metadata: body.keperluan ? { keperluan: body.keperluan } : {},
        tenantId: tenant.id,
        residentId: resident.id,
      },
    });
  }
}
