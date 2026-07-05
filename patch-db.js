const fs = require('fs');

let schema = fs.readFileSync('packages/database/prisma/schema.prisma', 'utf8');
schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
fs.writeFileSync('packages/database/prisma/schema.prisma', schema);

if (fs.existsSync('.env.example')) {
  let envExample = fs.readFileSync('.env.example', 'utf8');
  envExample = envExample.replace(/^DATABASE_URL=.*$/gm, '');
  envExample += '\nDATABASE_URL=\n';
  fs.writeFileSync('.env.example', envExample);
} else {
  fs.writeFileSync('.env.example', 'DATABASE_URL=\n');
}

console.log("Patched DB setup");
