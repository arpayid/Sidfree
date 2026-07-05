const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

server = server.replace(
  "execSync('npx prisma generate', { cwd: 'packages/database', stdio: 'inherit', env: process.env });",
  "execSync('npx prisma generate', { cwd: 'packages/database', stdio: 'inherit', env: process.env });\n    try { execSync('npm run seed', { cwd: 'packages/database', stdio: 'inherit', env: process.env }); } catch(e) {}"
);

fs.writeFileSync('server.js', server);
console.log("Patched server.js to run seed");
