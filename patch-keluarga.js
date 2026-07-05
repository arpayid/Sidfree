const fs = require('fs');
const file = 'apps/web-admin/app/keluarga/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\\`\\\${family.residents.length} Anggota\\`/,
  "`${family.residents.length} Anggota`"
);

fs.writeFileSync(file, content);
