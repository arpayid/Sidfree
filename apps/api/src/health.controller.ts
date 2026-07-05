import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async health() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('ready')
  async readiness() {
    try {
      const tenantCount = await this.prisma.tenant.count();
      return {
        ready: true,
        tenants: tenantCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        ready: false,
        error: error.message,
      };
    }
  }

  @Get('live')
  async liveness() {
    return {
      alive: true,
      timestamp: new Date().toISOString(),
    };
  }
}
