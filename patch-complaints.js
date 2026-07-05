const fs = require('fs');
const file = 'apps/api/src/complaints/complaints.controller.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  "import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';",
  "import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';"
);
content = content.replace(
  "export class ComplaintsController {",
  `export class ComplaintsController {
  @Put(':id')
  @RequirePermissions('write:complaint')
  update(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    return this.complaintsService.update(id, body, user.tenantId);
  }`
);
fs.writeFileSync(file, content);
