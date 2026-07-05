import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { LettersService } from "./letters.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../common/guards/permissions.guard";
import { RequirePermissions } from "../common/decorators/permissions.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("letters")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LettersController {
  @Put(":id")
  @RequirePermissions("write:letter")
  update(@Param("id") id: string, @Body() body: any, @CurrentUser() user: any) {
    return this.lettersService.update(id, body, user.tenantId);
  }
  constructor(private lettersService: LettersService) {}

  @Get()
  @RequirePermissions("read:letter")
  findAll(@CurrentUser() user: any) {
    return this.lettersService.findAll(user.tenantId);
  }

  @Get(":id")
  @RequirePermissions("read:letter")
  findOne(@Param("id") id: string, @CurrentUser() user: any) {
    return this.lettersService.findOne(id, user.tenantId);
  }

  @Post()
  @RequirePermissions("write:letter")
  create(@Body() body: any, @CurrentUser() user: any) {
    return this.lettersService.create(body, user.tenantId);
  }
}
