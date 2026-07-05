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
