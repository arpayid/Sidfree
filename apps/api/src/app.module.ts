import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PublicController } from "./public.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { AuditModule } from "./audit/audit.module";
import { ResidentsModule } from "./residents/residents.module";
import { FamiliesModule } from "./families/families.module";
import { LettersModule } from "./letters/letters.module";
import { ComplaintsModule } from "./complaints/complaints.module";

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    AuthModule,
    ResidentsModule,
    FamiliesModule,
    LettersModule,
    ComplaintsModule,
  ],
  controllers: [AppController, PublicController],
  providers: [],
})
export class AppModule {}
