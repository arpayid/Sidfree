const fs = require('fs');
let server = fs.readFileSync('server.js', 'utf8');

server = server.replace(
  "startApp('apps/api', API_PORT, script);",
  "const { execSync } = require('child_process');\nif (process.env.DATABASE_URL) {\n  console.log('Running prisma db push');\n  try {\n    execSync('npx prisma db push', { cwd: 'packages/database', stdio: 'inherit', env: process.env });\n    execSync('npx prisma generate', { cwd: 'packages/database', stdio: 'inherit', env: process.env });\n  } catch (e) {\n    console.error('Prisma push failed:', e);\n  }\n}\nstartApp('apps/api', API_PORT, script);"
);

fs.writeFileSync('server.js', server);
console.log("Patched server.js to run prisma db push");
