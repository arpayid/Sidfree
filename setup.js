const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function mkdir(p) { fs.mkdirSync(p, { recursive: true }); }
function write(p, content) { fs.writeFileSync(p, content.trim() + '\n'); }

mkdir('apps/web-public/app');
mkdir('apps/web-admin/app');
mkdir('apps/api/src');
mkdir('packages/database/prisma');
mkdir('packages/shared-types');
mkdir('packages/ui');

// ROOT
write('server.js', `
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');

const app = express();
const isDev = process.env.NODE_ENV !== 'production';

const WEB_PUBLIC_PORT = 3001;
const WEB_ADMIN_PORT = 3002;
const API_PORT = 3003;

function startApp(workspace, port, script) {
  const child = spawn('npm', ['run', script, '--workspace', workspace], {
    stdio: 'inherit',
    env: { ...process.env, PORT: port.toString() }
  });
}

const script = isDev ? 'dev' : 'start';
startApp('apps/web-public', WEB_PUBLIC_PORT, script);
startApp('apps/web-admin', WEB_ADMIN_PORT, script);
startApp('apps/api', API_PORT, script);

// NestJS on /api
app.use('/api', createProxyMiddleware({ target: \`http://127.0.0.1:\${API_PORT}\`, changeOrigin: true }));
// Admin on /admin
app.use('/admin', createProxyMiddleware({ target: \`http://127.0.0.1:\${WEB_ADMIN_PORT}\`, changeOrigin: true }));
// Public on /
app.use('/', createProxyMiddleware({ target: \`http://127.0.0.1:\${WEB_PUBLIC_PORT}\`, changeOrigin: true }));

app.listen(3000, () => {
  console.log('Proxy on 3000');
});
`);

const rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
rootPkg.workspaces = ["apps/*", "packages/*"];
rootPkg.scripts = {
  "dev": "node server.js",
  "build": "npm run build --workspaces --if-present",
  "start": "node server.js",
  "lint": "npm run lint --workspaces --if-present",
  "postinstall": "npm run generate --workspaces --if-present"
};
rootPkg.dependencies = {
  ...rootPkg.dependencies,
  "express": "^4.21.2",
  "http-proxy-middleware": "^3.0.0",
};
fs.writeFileSync('package.json', JSON.stringify(rootPkg, null, 2));

// packages/database
write('packages/database/package.json', `
{
  "name": "@sidpro/database",
  "version": "1.0.0",
  "main": "index.ts",
  "scripts": {
    "generate": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^6.4.1"
  },
  "devDependencies": {
    "prisma": "^6.4.1"
  }
}
`);
write('packages/database/prisma/schema.prisma', `
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
generator client {
  provider = "prisma-client-js"
}
model Tenant {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
}
`);

// apps/api (NestJS)
write('apps/api/package.json', `
{
  "name": "api",
  "version": "1.0.0",
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "nest start"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.11",
    "@nestjs/core": "^11.0.11",
    "@nestjs/platform-express": "^11.0.11",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.2",
    "@sidpro/database": "*"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.5",
    "typescript": "^5.7.3"
  }
}
`);
write('apps/api/nest-cli.json', `
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
`);
write('apps/api/tsconfig.json', `
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallbackArgs": false
  }
}
`);
write('apps/api/src/main.ts', `
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3003);
}
bootstrap();
`);
write('apps/api/src/app.module.ts', `
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
`);
write('apps/api/src/app.controller.ts', `
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello from NestJS API';
  }
}
`);

// apps/web-public
write('apps/web-public/package.json', `
{
  "name": "web-public",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.4.9",
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "lucide-react": "^0.553.0",
    "tailwindcss": "4.1.11",
    "@tailwindcss/postcss": "4.1.11"
  },
  "devDependencies": {
    "typescript": "5.9.3",
    "@types/react": "^19.0.0",
    "@types/node": "^20.0.0"
  }
}
`);
write('apps/web-public/next.config.ts', `
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
};
export default nextConfig;
`);
write('apps/web-public/tsconfig.json', `
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`);
// apps/web-admin
write('apps/web-admin/package.json', `
{
  "name": "web-admin",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.4.9",
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "lucide-react": "^0.553.0",
    "tailwindcss": "4.1.11",
    "@tailwindcss/postcss": "4.1.11"
  },
  "devDependencies": {
    "typescript": "5.9.3",
    "@types/react": "^19.0.0",
    "@types/node": "^20.0.0"
  }
}
`);
write('apps/web-admin/next.config.ts', `
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  basePath: '/admin',
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
};
export default nextConfig;
`);
write('apps/web-admin/tsconfig.json', `
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`);

// Move app files
if (fs.existsSync('app/page.tsx')) fs.renameSync('app/page.tsx', 'apps/web-public/app/page.tsx');
if (fs.existsSync('app/layout.tsx')) fs.renameSync('app/layout.tsx', 'apps/web-public/app/layout.tsx');
if (fs.existsSync('app/globals.css')) {
  fs.copyFileSync('app/globals.css', 'apps/web-public/app/globals.css');
  fs.renameSync('app/globals.css', 'apps/web-admin/app/globals.css');
}

// Move admin files
if (fs.existsSync('app/admin/layout.tsx')) {
  fs.renameSync('app/admin/layout.tsx', 'apps/web-admin/app/layout.tsx');
} else {
  write('apps/web-admin/app/layout.tsx', `
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin SIDPRO",
  description: "Dashboard Admin SIDPRO",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
`);
}

if (fs.existsSync('app/admin/page.tsx')) {
  fs.renameSync('app/admin/page.tsx', 'apps/web-admin/app/page.tsx');
} else {
  write('apps/web-admin/app/page.tsx', `export default function Page() { return <div>Admin Page</div>; }`);
}

if (fs.existsSync('app/admin/residents')) {
  fs.renameSync('app/admin/residents', 'apps/web-admin/app/residents');
}

// Clear old root Next.js stuff
const oldDirs = ['app', 'components', 'hooks', 'lib', 'public', '.next'];
for (const d of oldDirs) {
  if (fs.existsSync(d)) fs.rmSync(d, { recursive: true, force: true });
}
const oldFiles = ['next.config.ts', 'tsconfig.json', 'postcss.config.mjs', 'eslint.config.mjs'];
for (const f of oldFiles) {
  if (fs.existsSync(f)) fs.rmSync(f, { force: true });
}

console.log('Setup complete!');
