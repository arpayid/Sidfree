import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { AiService } from "./ai/ai.service";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubmitComplaintDto, SubmitLetterDto } from './dto/public.dto';

@ApiTags('public')
@Controller("public")
export class PublicController {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService
  ) {}

  @Post("complaints")
  @ApiOperation({ summary: 'Submit a new complaint' })
  @ApiResponse({ status: 201, description: 'Complaint created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async submitComplaint(@Body() body: SubmitComplaintDto) {
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant)
      throw new HttpException("Tenant not found", HttpStatus.NOT_FOUND);

    // AI ANALYSIS
    const aiAnalysis = await this.aiService.analyzeComplaint(body.content);

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
        status: aiAnalysis.priority === "high" ? "Pending" : "Pending", // Or whatever logic you want
      },
    });
  }

  @Post("letters")
  @ApiOperation({ summary: 'Submit a new letter request' })
  @ApiResponse({ status: 201, description: 'Letter request created' })
  @ApiResponse({ status: 404, description: 'NIK not registered' })
  async submitLetter(@Body() body: SubmitLetterDto) {
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

  @Post("ai-template")
  @ApiOperation({ summary: 'Generate AI template' })
  @ApiResponse({ status: 201, description: 'Template generated' })
  async getAiTemplate(@Body() body: any) {
    const template = await this.aiService.analyzeLetter(body.type, body.metadata || {});
    return { template };
  }
}
