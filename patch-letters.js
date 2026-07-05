const fs = require('fs');
const file = 'apps/api/src/letters/letters.controller.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  "export class LettersController {",
  `export class LettersController {
  @Put(':id')
  @RequirePermissions('write:letter')
  update(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    return this.lettersService.update(id, body, user.tenantId);
  }`
);
fs.writeFileSync(file, content);
