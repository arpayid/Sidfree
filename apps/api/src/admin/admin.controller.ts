import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private prisma: PrismaService) {}

  @Patch('letters/:id/sign')
  async signLetter(@Param('id') id: string, @Request() req: any) {
    const letter = await this.prisma.letter.findUnique({ where: { id } });
    if (!letter) throw new HttpException("Letter not found", 404);
    if (letter.status === 'Rejected') throw new HttpException("Cannot sign a rejected letter", 400);
    if (letter.signature) throw new HttpException("Letter is already signed", 400);

    const qrCode = crypto.randomBytes(16).toString('hex');
    const signature = `SIGNED_BY_${req.user.userId}_${Date.now()}`;
    return this.prisma.letter.update({
      where: { id, tenantId: req.user.tenantId },
      data: { status: 'Approved', signature, qrCode }
    });
  }

  @Get('payments')
  async getPayments(@Request() req: any) {
    return this.prisma.payment.findMany({
      where: { tenantId: req.user.tenantId },
      include: { resident: { select: { name: true, nik: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
  
  @Get('businesses')
  async getBusinesses(@Request() req: any) {
    return this.prisma.business.findMany({
      where: { tenantId: req.user.tenantId },
      include: { resident: { select: { name: true } } }
    });
  }
}
