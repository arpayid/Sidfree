import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { LettersService } from "./letters.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { RequirePermissions } from "../common/decorators/permissions.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { AuditService } from "../audit/audit.service";

@Controller("letters")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LettersController {
  constructor(
    private lettersService: LettersService,
    private auditService: AuditService,
  ) {}

  @Get()
  @RequirePermissions("read:letter")
  async findAll(@CurrentUser() user: any) {
    const letters = await this.lettersService.findAll(user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "READ_LIST",
      "Letter",
    );
    return letters;
  }

  @Get(":id")
  @RequirePermissions("read:letter")
  async findOne(@Param("id") id: string, @CurrentUser() user: any) {
    const letter = await this.lettersService.findOne(id, user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "READ_DETAIL",
      "Letter",
      { letterId: id },
    );
    return letter;
  }

  @Post()
  @RequirePermissions("write:letter")
  async create(@Body() body: any, @CurrentUser() user: any) {
    const letter = await this.lettersService.create(body, user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "CREATE",
      "Letter",
      { letterId: letter.id },
    );
    return letter;
  }

  @Put(":id")
  @RequirePermissions("write:letter")
  async update(@Param("id") id: string, @Body() body: any, @CurrentUser() user: any) {
    const letter = await this.lettersService.update(id, body, user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "UPDATE",
      "Letter",
      { letterId: letter.id, updates: body },
    );
    return letter;
  }

  @Delete(":id")
  @RequirePermissions("write:letter")
  async remove(@Param("id") id: string, @CurrentUser() user: any) {
    const letter = await this.lettersService.remove(id, user.tenantId);
    await this.auditService.log(
      user.tenantId,
      user.userId,
      "DELETE",
      "Letter",
      { letterId: id },
    );
    return letter;
  }
}
