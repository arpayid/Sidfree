const fs = require('fs');
let code = fs.readFileSync('apps/api/src/public.controller.ts', 'utf8');
code = code.replace(/let residentId = null;\n    if \(body\.nik\) {\n      const resident = await this\.prisma\.resident\.findFirst\({/, `let residentId = null;
    let resident = null;
    if (body.nik) {
      resident = await this.prisma.resident.findFirst({`);
fs.writeFileSync('apps/api/src/public.controller.ts', code);
