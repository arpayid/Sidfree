import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma/prisma.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private prisma: PrismaService) {}

  @Get('stats')
  async getStats(@Request() req: any) {
    const tenantId = req.user.tenantId;

    const [totalResidents, totalFamilies, totalLetters, pendingComplaints] = await Promise.all([
      this.prisma.resident.count({ where: { tenantId } }),
      this.prisma.family.count({ where: { tenantId } }),
      this.prisma.letter.count({ where: { tenantId, status: 'Resolved' } }),
      this.prisma.complaint.count({ where: { tenantId, status: 'Pending' } }),
    ]);

    // Simple mock for chart data - in reality we would group by month
    const chartData = [
      { name: "Jan", surat: 10, aduan: 2 },
      { name: "Feb", surat: 15, aduan: 5 },
      { name: "Mar", surat: 8, aduan: 1 },
      { name: "Apr", surat: 14, aduan: 3 },
      { name: "Mei", surat: 20, aduan: 4 },
      { name: "Jun", surat: Math.floor(totalLetters/2), aduan: pendingComplaints },
    ];

    return {
      totalResidents,
      totalFamilies,
      totalLetters,
      pendingComplaints,
      chartData
    };
  }
}
