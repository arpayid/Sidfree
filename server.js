require("dotenv").config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');

const app = express();
const isDev = process.env.NODE_ENV !== 'production';

const WEB_PUBLIC_PORT = 3001;
const WEB_ADMIN_PORT = 3002;
const API_PORT = 3003;

const childProcesses = [];

function startApp(workspace, port, script) {
  const args = ['run', script, '--workspace', workspace];
  if (workspace.includes('web-')) {
    args.push('--', '--port', port.toString());
  }
  console.log(`Starting ${workspace} on port ${port} with args ${args.join(' ')}`);
  const child = spawn('npm', args, {
    stdio: 'inherit',
    env: { ...process.env, PORT: port.toString() }
  });
  
  child.on('error', (err) => console.error(`Error in ${workspace}:`, err));
  child.on('exit', (code) => console.log(`${workspace} exited with code ${code}`));
  
  childProcesses.push(child);
}

const script = isDev ? 'dev' : 'start';
startApp('apps/web-public', WEB_PUBLIC_PORT, script);
startApp('apps/web-admin', WEB_ADMIN_PORT, script);
const { execSync } = require('child_process');

if (process.env.SQL_HOST && process.env.SQL_USER && process.env.SQL_PASSWORD && process.env.SQL_DB_NAME) {
  // Construct Prisma DATABASE_URL from Cloud SQL credentials for runtime
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

// For Prisma DB push and seed, we need admin privileges
if (process.env.SQL_HOST && process.env.SQL_ADMIN_USER && process.env.SQL_ADMIN_PASSWORD && process.env.SQL_DB_NAME) {
  const adminUser = encodeURIComponent(process.env.SQL_ADMIN_USER);
  const adminPassword = encodeURIComponent(process.env.SQL_ADMIN_PASSWORD);
  const dbName = process.env.SQL_DB_NAME;
  const host = process.env.SQL_HOST;
  
  let adminUrl = '';
  if (host.startsWith('/')) {
    adminUrl = `postgresql://${adminUser}:${adminPassword}@localhost/${dbName}?host=${encodeURIComponent(host)}`;
  } else {
    adminUrl = `postgresql://${adminUser}:${adminPassword}@${host}/${dbName}`;
  }
  
  console.log('Running prisma db push with admin user');
  try {
    execSync('npx prisma db push', { cwd: 'packages/database', stdio: 'inherit', env: { ...process.env, DATABASE_URL: adminUrl } });
    execSync('npx prisma generate', { cwd: 'packages/database', stdio: 'inherit', env: { ...process.env, DATABASE_URL: adminUrl } });
    try { execSync('npm run seed', { cwd: 'packages/database', stdio: 'inherit', env: { ...process.env, DATABASE_URL: adminUrl } }); } catch(e) {}
  } catch (e) {
    console.error('Prisma push failed:', e);
  }
} else if (process.env.DATABASE_URL) {
  // Fallback for local sqlite or direct DATABASE_URL usage
  console.log('Running prisma db push with generic url');
  try {
    execSync('npx prisma db push', { cwd: 'packages/database', stdio: 'inherit', env: process.env });
    execSync('npx prisma generate', { cwd: 'packages/database', stdio: 'inherit', env: process.env });
    try { execSync('npm run seed', { cwd: 'packages/database', stdio: 'inherit', env: process.env }); } catch(e) {}
  } catch (e) {
    console.error('Prisma push failed:', e);
  }
}
startApp('apps/api', API_PORT, script);

const apiProxy = createProxyMiddleware({ target: `http://127.0.0.1:${API_PORT}`, changeOrigin: true });
const adminProxy = createProxyMiddleware({ target: `http://127.0.0.1:${WEB_ADMIN_PORT}`, changeOrigin: true });
const publicProxy = createProxyMiddleware({ target: `http://127.0.0.1:${WEB_PUBLIC_PORT}`, changeOrigin: true });

app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    return apiProxy(req, res, next);
  }
  if (req.url.startsWith('/admin')) {
    return adminProxy(req, res, next);
  }
  return publicProxy(req, res, next);
});

const server = app.listen(3000, () => {
  console.log('Proxy on 3000');
});

function cleanup() {
  childProcesses.forEach(child => child.kill('SIGTERM'));
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
