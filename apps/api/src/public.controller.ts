import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { AiService } from "./ai/ai.service";
import { WhatsappService } from "./whatsapp/whatsapp.service";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubmitComplaintDto, SubmitLetterDto } from './dto/public.dto';

@ApiTags('public')
@Controller("public")
export class PublicController {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private whatsappService: WhatsappService
  ) {}

  @Post("complaints")
  @ApiOperation({ summary: 'Submit a new complaint' })
  async submitComplaint(@Body() body: SubmitComplaintDto) {
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant) throw new HttpException("Tenant not found", HttpStatus.NOT_FOUND);

    const aiAnalysis = await this.aiService.analyzeComplaint(body.content);
    let residentId = null;
    let resident = null;

    if (body.nik) {
      resident = await this.prisma.resident.findFirst({
        where: { nik: body.nik, tenantId: tenant.id },
      });
      if (resident) residentId = resident.id;
    }

    const complaint = await this.prisma.complaint.create({
      data: {
        title: body.title,
        content: body.content,
        tenantId: tenant.id,
        residentId,
        status: aiAnalysis.priority === "high" ? "Pending" : "Pending",
      },
    });

    if (resident && resident.phone) {
      this.whatsappService.sendMessage(
        resident.phone,
        `Halo ${resident.name}, aduan Anda mengenai "${body.title}" telah kami terima dan sedang diproses. Prioritas: ${aiAnalysis.priority}.`
      );
    }
    return complaint;
  }

  @Post("letters")
  @ApiOperation({ summary: 'Submit a new letter request' })
  async submitLetter(@Body() body: SubmitLetterDto) {
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant) throw new HttpException("Tenant not found", HttpStatus.NOT_FOUND);

    if (!body.nik) throw new HttpException("NIK diperlukan", HttpStatus.BAD_REQUEST);

    const resident = await this.prisma.resident.findFirst({
      where: { nik: body.nik, tenantId: tenant.id },
    });
    if (!resident) throw new HttpException("NIK tidak terdaftar", HttpStatus.NOT_FOUND);

    const letter = await this.prisma.letter.create({
      data: {
        type: body.type,
        metadata: body.keperluan ? { keperluan: body.keperluan } : {},
        tenantId: tenant.id,
        residentId: resident.id,
      },
    });

    if (resident.phone) {
      this.whatsappService.sendMessage(
        resident.phone,
        `Halo ${resident.name}, permohonan surat ${body.type} Anda telah kami terima dan akan segera diproses.`
      );
    }
    return letter;
  }

  // Modul TTE & Validasi QR Code
  @Get("letters/verify/:qrCode")
  @ApiOperation({ summary: 'Verify Letter by QR Code' })
  async verifyLetter(@Param('qrCode') qrCode: string) {
    const letter = await this.prisma.letter.findFirst({
      where: { qrCode },
      include: { resident: true, tenant: true },
    });
    
    if (!letter) throw new HttpException("Surat tidak ditemukan / palsu", HttpStatus.NOT_FOUND);
    
    return {
      valid: true,
      letter: {
        type: letter.type,
        status: letter.status,
        date: letter.updatedAt,
        residentName: letter.resident.name,
        tenantName: letter.tenant.name,
      }
    };
  }

  // Modul Keuangan & Pembayaran
  @Get("payments/billing")
  @ApiOperation({ summary: 'Check resident billing' })
  async checkBilling(@Query('nik') nik: string) {
    const tenant = await this.prisma.tenant.findFirst();
    const resident = await this.prisma.resident.findFirst({
      where: { nik, tenantId: tenant?.id },
    });
    if (!resident) throw new HttpException("NIK tidak ditemukan", HttpStatus.NOT_FOUND);
    
    const bills = await this.prisma.payment.findMany({
      where: { residentId: resident.id, status: 'Pending' }
    });
    return { resident: { name: resident.name }, bills };
  }
  
  @Post("payments/pay/:id")
  @ApiOperation({ summary: 'Simulate payment (Mock Payment Gateway)' })
  async simulatePayment(@Param('id') id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id }, include: { resident: true } });
    if (!payment) throw new HttpException("Tagihan tidak ditemukan", HttpStatus.NOT_FOUND);
    
    const updated = await this.prisma.payment.update({
      where: { id },
      data: { status: 'Success', reference: `PAY-${Date.now()}` }
    });
    
    if (payment.resident.phone) {
      this.whatsappService.sendMessage(
        payment.resident.phone,
        `Terima kasih ${payment.resident.name}, pembayaran ${payment.type} sebesar Rp${payment.amount} telah berhasil.`
      );
    }
    
    return updated;
  }

  // Modul Etalase Potensi Desa & UMKM
  @Get("businesses")
  @ApiOperation({ summary: 'Get all active businesses' })
  async getBusinesses() {
    return this.prisma.business.findMany({
      where: { status: 'Active' },
      include: { resident: { select: { name: true } } }
    });
  }

  @Post("ai-template")
  @ApiOperation({ summary: 'Generate AI template' })
  async getAiTemplate(@Body() body: any) {
    const template = await this.aiService.analyzeLetter(body.type, body.metadata || {});
    return { template };
  }
}
