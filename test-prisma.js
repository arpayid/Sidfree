const { execSync } = require('child_process');
if (process.env.SQL_HOST && process.env.SQL_USER && process.env.SQL_PASSWORD && process.env.SQL_DB_NAME) {
  const user = encodeURIComponent(process.env.SQL_USER);
  const password = encodeURIComponent(process.env.SQL_PASSWORD);
  const dbName = process.env.SQL_DB_NAME;
  const host = process.env.SQL_HOST;
  if (host.startsWith('/')) {
    process.env.DATABASE_URL = `postgresql://${user}:${password}@localhost/${dbName}?host=${encodeURIComponent(host)}`;
  } else {
    process.env.DATABASE_URL = `postgresql://${user}:${password}@${host}/${dbName}`;
  }
}
console.log("DB URL:", process.env.DATABASE_URL);
try {
  execSync('npx prisma db push', { cwd: 'packages/database', stdio: 'inherit', env: process.env });
} catch (e) {
  console.error(e);
}
