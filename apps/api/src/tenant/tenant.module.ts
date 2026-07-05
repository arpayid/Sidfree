import { Module } from "@nestjs/common";
import { TenantController } from "./tenant.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [TenantController],
  providers: [PrismaService]
})
export class TenantModule {}
