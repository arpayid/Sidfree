import { Module } from "@nestjs/common";
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from "./app.controller";
import { PublicController } from "./public.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { AuditModule } from "./audit/audit.module";
import { ResidentsModule } from "./residents/residents.module";
import { FamiliesModule } from "./families/families.module";
import { LettersModule } from "./letters/letters.module";
import { ComplaintsModule } from "./complaints/complaints.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { TenantModule } from "./tenant/tenant.module";

import { AiService } from "./ai/ai.service";

import { HealthController } from "./health.controller";

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    PrismaModule,
    AuditModule,
    AuthModule,
    ResidentsModule,
    FamiliesModule,
    LettersModule,
    ComplaintsModule,
    DashboardModule,
    TenantModule,
  ],
  controllers: [AppController, PublicController, HealthController],
  providers: [
    AiService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
  exports: [AiService],
})
export class AppModule {}
