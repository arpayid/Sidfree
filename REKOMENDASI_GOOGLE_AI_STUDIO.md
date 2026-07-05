# 🎯 REKOMENDASI DETAIL UNTUK GOOGLE AI STUDIO DEPLOYMENT
## SIDPRO - Sistem Informasi Desa

**Tanggal**: 5 Juli 2026  
**Status Repository**: arpayid/Sidfree  
**Versi Dokumen**: 1.0

---

## 📋 DAFTAR ISI

1. [Integrasi Gemini AI (CRITICAL)](#1-integrasi-gemini-ai-critical)
2. [Production-Ready Configuration (HIGH)](#2-production-ready-configuration-high)
3. [Architecture & Reliability (MEDIUM-HIGH)](#3-architecture--reliability-medium-high)
4. [API Documentation & Type Safety (MEDIUM)](#4-api-documentation--type-safety-medium)
5. [Testing & CI/CD (MEDIUM)](#5-testing--cicd-medium)
6. [Frontend Optimization (MEDIUM)](#6-frontend-optimization-medium)
7. [Security & Data Protection (HIGH)](#7-security--data-protection-high)
8. [Deployment Preparation (HIGH)](#8-deployment-preparation-high)
9. [Documentation (MEDIUM)](#9-documentation-medium)
10. [Implementation Checklist](#-implementation-checklist)

---

## 1. 🔴 INTEGRASI GEMINI AI (CRITICAL)

### 1.1 Aktivasi Gemini API di Codebase

Saat ini `metadata.json` declare `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` tapi **tidak ada implementasi** di code.

#### File: `apps/api/src/ai/ai.service.ts` (BUAT BARU)

```typescript
import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private client: GoogleGenerativeAI;

  constructor() {
    this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async analyzeLetter(letterType: string, metadata: any): Promise<string> {
    // Gunakan Gemini untuk generate preview/template surat
    const model = this.client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Generate template ${letterType} dengan data: ${JSON.stringify(metadata)}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async analyzeComplaint(content: string): Promise<{ priority: string; category: string }> {
    // Sentiment analysis + categorization untuk aduan
    const model = this.client.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `Analisis aduan warga ini dan tentukan prioritas (low/medium/high) dan kategori:
    "${content}"
    Respond in JSON format: { priority, category, summary }`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }
}
```

#### Update: `package.json` (apps/api)

```json
{
  "dependencies": {
    "@google/generative-ai": "^0.5.0",
    "@nestjs/common": "^11.0.11",
    "@nestjs/core": "^11.0.11"
  }
}
```

#### Update: `apps/api/src/app.module.ts`

```typescript
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PublicController } from "./public.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { AuditModule } from "./audit/audit.module";
import { ResidentsModule } from "./residents/residents.module";
import { FamiliesModule } from "./families/families.module";
import { LettersModule } from "./letters/letters.module";
import { ComplaintsModule } from "./complaints/complaints.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { TenantModule } from "./tenant/tenant.module";
import { AiService } from "./ai/ai.service";

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    AuthModule,
    ResidentsModule,
    FamiliesModule,
    LettersModule,
    ComplaintsModule,
    DashboardModule,
    TenantModule,
  ],
  controllers: [AppController, PublicController],
  providers: [AiService],
  exports: [AiService],
})
export class AppModule {}
```

#### Update: `apps/api/src/public.controller.ts`

```typescript
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { AiService } from "./ai/ai.service";

@Injectable()
@Controller("public")
export class PublicController {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService
  ) {}

  @Post("complaints")
  async submitComplaint(@Body() body: any) {
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant)
      throw new HttpException("Tenant not found", HttpStatus.NOT_FOUND);

    // 🚀 AI ANALYSIS
    const aiAnalysis = await this.aiService.analyzeComplaint(body.content);

    let residentId = null;
    if (body.nik) {
      const resident = await this.prisma.resident.findFirst({
        where: { nik: body.nik, tenantId: tenant.id },
      });
      if (resident) residentId = resident.id;
    }

    return this.prisma.complaint.create({
      data: {
        title: body.title,
        content: body.content,
        tenantId: tenant.id,
        residentId,
        status: aiAnalysis.priority === "high" ? "Pending" : "Pending",
        metadata: aiAnalysis,
      },
    });
  }

  @Post("letters")
  async submitLetter(@Body() body: any) {
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant)
      throw new HttpException("Tenant not found", HttpStatus.NOT_FOUND);

    if (!body.nik) {
      throw new HttpException(
        "NIK diperlukan untuk pengajuan surat",
        HttpStatus.BAD_REQUEST
      );
    }

    const resident = await this.prisma.resident.findFirst({
      where: { nik: body.nik, tenantId: tenant.id },
    });
    if (!resident) {
      throw new HttpException(
        "NIK tidak terdaftar sebagai warga",
        HttpStatus.NOT_FOUND
      );
    }

    return this.prisma.letter.create({
      data: {
        type: body.type,
        metadata: body.keperluan ? { keperluan: body.keperluan } : {},
        tenantId: tenant.id,
        residentId: resident.id,
      },
    });
  }
}
```

---

## 2. 🟠 PRODUCTION-READY CONFIGURATION (HIGH)

### 2.1 Cloud SQL Integration untuk Google Cloud Run

#### Update: `server.js` - ENHANCE DB CONNECTION

```javascript
require("dotenv").config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');
const { execSync } = require('child_process');

const app = express();
const isDev = process.env.NODE_ENV !== 'production';

const WEB_PUBLIC_PORT = 3001;
const WEB_ADMIN_PORT = 3002;
const API_PORT = 3003;

const childProcesses = [];

// ✅ VALIDATE CRITICAL ENV VARS
const REQUIRED_ENV = ['GEMINI_API_KEY'];
const missing = REQUIRED_ENV.filter(v => !process.env[v]);
if (missing.length > 0) {
  console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

// ✅ CONFIGURE DATABASE URL
if (process.env.CLOUD_SQL_CONNECTION_NAME) {
  // Cloud SQL Socket
  const socketPath = `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`;
  process.env.DATABASE_URL = `postgresql://${encodeURIComponent(process.env.SQL_USER)}:${encodeURIComponent(process.env.SQL_PASSWORD)}@/${process.env.SQL_DB_NAME}?host=${encodeURIComponent(socketPath)}`;
  console.log('✅ Using Cloud SQL via Unix socket');
} else if (process.env.SQL_HOST && process.env.SQL_USER && process.env.SQL_PASSWORD) {
  const user = encodeURIComponent(process.env.SQL_USER);
  const password = encodeURIComponent(process.env.SQL_PASSWORD);
  const dbName = process.env.SQL_DB_NAME;
  const host = process.env.SQL_HOST;

  if (host.startsWith('/')) {
    process.env.DATABASE_URL = `postgresql://${user}:${password}@localhost/${dbName}?host=${encodeURIComponent(host)}`;
  } else {
    process.env.DATABASE_URL = `postgresql://${user}:${password}@${host}:5432/${dbName}`;
  }
  console.log('✅ Using PostgreSQL TCP connection');
} else if (!process.env.DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL not configured, defaulting to SQLite');
  process.env.DATABASE_URL = 'file:./dev.db';
}

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

// ✅ DATABASE INITIALIZATION
if (process.env.SQL_HOST && process.env.SQL_ADMIN_USER && process.env.SQL_ADMIN_PASSWORD && process.env.SQL_DB_NAME) {
  const adminUser = encodeURIComponent(process.env.SQL_ADMIN_USER);
  const adminPassword = encodeURIComponent(process.env.SQL_ADMIN_PASSWORD);
  const dbName = process.env.SQL_DB_NAME;
  const host = process.env.SQL_HOST;
  
  let adminUrl = '';
  if (host.startsWith('/')) {
    adminUrl = `postgresql://${adminUser}:${adminPassword}@localhost/${dbName}?host=${encodeURIComponent(host)}`;
  } else {
    adminUrl = `postgresql://${adminUser}:${adminPassword}@${host}:5432/${dbName}`;
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

// ✅ HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({ status: 'proxy-ok', timestamp: new Date().toISOString() });
});

app.get('/health/ready', (req, res) => {
  res.json({ ready: true });
});

app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    return apiProxy(req, res, next);
  }
  if (req.url.startsWith('/admin')) {
    return adminProxy(req, res, next);
  }
  return publicProxy(req, res, next);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`✅ Proxy listening on port ${PORT}`);
});

// ✅ GRACEFUL SHUTDOWN
function cleanup() {
  console.log('⏸️  Shutting down gracefully...');
  
  childProcesses.forEach(child => {
    child.kill('SIGTERM');
  });
  
  server.close(() => {
    console.log('✅ Shutdown complete');
    process.exit(0);
  });
  
  setTimeout(() => {
    console.log('❌ Force shutdown timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  cleanup();
});
```

### 2.2 Update `.env.example` dengan semua required vars

```dotenv
# ============================================
# GOOGLE AI STUDIO - CRITICAL VARIABLES
# ============================================

# Gemini API Key (required untuk AI features)
# Dapatkan dari: https://aistudio.google.com/app/apikey
GEMINI_API_KEY="your_gemini_api_key_here"

# Application URL (injected by AI Studio)
APP_URL="https://your-cloud-run-url.run.app"

# ============================================
# DATABASE CONFIGURATION
# ============================================

# Option A: Cloud SQL (Recommended for GCP)
CLOUD_SQL_CONNECTION_NAME="project:region:instance"
SQL_USER="postgres"
SQL_PASSWORD="secure_password"
SQL_DB_NAME="sidpro"
SQL_ADMIN_USER="postgres"
SQL_ADMIN_PASSWORD="admin_password"

# Option B: Direct PostgreSQL Connection
# DATABASE_URL="postgresql://user:password@host:5432/sidpro"

# ============================================
# NODE ENVIRONMENT
# ============================================

NODE_ENV="production"
PORT="8080"
LOG_LEVEL="info"

# ============================================
# SECURITY
# ============================================

JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="24h"
```

### 2.3 Update `metadata.json` dengan capabilities lengkap

```json
{
  "name": "SIDPRO - Sistem Informasi Desa",
  "description": "Platform multi-tenant untuk administrasi desa: kelola warga, surat, dan aduan dengan AI-powered categorization.",
  "author": "arpayid",
  "version": "1.0.0",
  "requestFramePermissions": [],
  "majorCapabilities": [
    "MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"
  ],
  "keywords": ["desa", "administrasi", "surat", "aduan", "multi-tenant", "gemini"],
  "minSdkVersion": "1.0.0",
  "maxSdkVersion": "999.0.0",
  "homepage": "https://github.com/arpayid/Sidfree"
}
```

---

## 3. 🟡 ARCHITECTURE & RELIABILITY (MEDIUM-HIGH)

### 3.1 Consolidate Patchfiles - Create Migration Script

#### File: `scripts/migrate-to-monorepo.sh` (BUAT BARU)

```bash
#!/bin/bash
set -e

echo "🔧 Sidfree Migration Script"
echo "================================"

# Step 1: Validate environment
echo "✓ Validating environment..."
if [[ -z "$DATABASE_URL" && -z "$CLOUD_SQL_CONNECTION_NAME" ]]; then
  echo "❌ DATABASE_URL or CLOUD_SQL_CONNECTION_NAME not set"
  echo "⚠️  Set DATABASE_URL environment variable first"
  exit 1
fi

# Step 2: Install dependencies
echo "✓ Installing dependencies..."
npm install

# Step 3: Initialize database
echo "✓ Initializing database..."
cd packages/database
npm install
npm run generate
npx prisma db push --skip-generate
npm run seed
cd ../..

# Step 4: Build all workspaces
echo "✓ Building workspaces..."
npm run build

# Step 5: Verify
echo "✓ Verifying installation..."
npm run lint || true

echo "✅ Migration complete!"
echo ""
echo "Next steps:"
echo "  1. Start dev server:  npm run dev"
echo "  2. Public portal:     http://localhost:3000"
echo "  3. Admin dashboard:   http://localhost:3000/admin"
echo "  4. API docs:          http://localhost:3000/api/docs"
echo ""
```

#### File: `MIGRATION_GUIDE.md` (BUAT BARU)

```markdown
# Migration Guide

## Setup Steps

### Prerequisites
- Node.js 18+
- PostgreSQL 13+ (or Cloud SQL)
- Google Cloud Account
- Gemini API Key

### Local Development

\`\`\`bash
# 1. Clone repository
git clone https://github.com/arpayid/Sidfree.git
cd Sidfree

# 2. Make migration script executable
chmod +x scripts/migrate-to-monorepo.sh

# 3. Set DATABASE_URL
export DATABASE_URL="postgresql://user:password@localhost/sidpro"
# OR
export CLOUD_SQL_CONNECTION_NAME="project:region:instance"

# 4. Run migration script
./scripts/migrate-to-monorepo.sh

# 5. Start dev server
npm run dev
\`\`\`

### Access Points

After running dev server:
- 🌐 Public Portal: http://localhost:3000
- 🔧 Admin Dashboard: http://localhost:3000/admin
- 📚 API Docs: http://localhost:3000/api/docs
- ⚙️  API: http://localhost:3000/api
```

### 3.2 Add Health Check Endpoints

#### File: `apps/api/src/health.controller.ts` (BUAT BARU)

```typescript
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async health() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('ready')
  async readiness() {
    try {
      const tenantCount = await this.prisma.tenant.count();
      return {
        ready: true,
        tenants: tenantCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        ready: false,
        error: error.message,
      };
    }
  }

  @Get('live')
  async liveness() {
    return {
      alive: true,
      timestamp: new Date().toISOString(),
    };
  }
}
```

#### Update: `apps/api/src/app.module.ts`

```typescript
import { HealthController } from './health.controller';

@Module({
  controllers: [AppController, PublicController, HealthController],
  // ... rest of module
})
export class AppModule {}
```

---

## 4. 🟢 API DOCUMENTATION & TYPE SAFETY (MEDIUM)

### 4.1 Add OpenAPI/Swagger Documentation

#### Install packages:

```bash
npm install --save @nestjs/swagger swagger-ui-express
```

#### Update: `apps/api/src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // 🔵 Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('SIDPRO API')
    .setDescription('Sistem Informasi Desa - API Documentation')
    .setVersion('1.0.0')
    .addTag('public', 'Public endpoints (complaints, letters)')
    .addTag('admin', 'Admin endpoints (requires auth)')
    .addTag('health', 'Health check endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: [
      process.env.APP_URL || 'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const PORT = process.env.PORT || 3003;
  await app.listen(PORT, () => {
    console.log(`🚀 API running on port ${PORT}`);
    console.log(`📚 API docs: http://localhost:${PORT}/docs`);
  });
}

bootstrap();
```

### 4.2 Add Input Validation DTOs

#### File: `apps/api/src/public/dto/submit-complaint.dto.ts` (BUAT BARU)

```typescript
import { IsString, IsNotEmpty, Length, Optional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitComplaintDto {
  @ApiProperty({
    description: 'Judul aduan',
    example: 'Jalan rusak di depan rumah',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  title: string;

  @ApiProperty({
    description: 'Isi detail aduan',
    example: 'Jalan di depan rumah nomor 42 rusak parah, ada lubang besar',
    minLength: 10,
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 2000)
  content: string;

  @ApiProperty({
    description: 'NIK warga (opsional)',
    example: '1234567890123456',
    required: false,
    minLength: 16,
    maxLength: 16,
  })
  @IsString()
  @Optional()
  @Length(16, 16)
  nik?: string;
}

export class SubmitLetterDto {
  @ApiProperty({
    description: 'Jenis surat',
    enum: ['SKTM', 'Domisili', 'Pengantar', 'Keterangan Usaha'],
  })
  @IsString()
  @IsNotEmpty()
  type: 'SKTM' | 'Domisili' | 'Pengantar' | 'Keterangan Usaha';

  @ApiProperty({
    description: 'NIK pemohon (16 digit)',
    example: '1234567890123456',
    minLength: 16,
    maxLength: 16,
  })
  @IsString()
  @IsNotEmpty()
  @Length(16, 16)
  nik: string;

  @ApiProperty({
    description: 'Keperluan/alasan pengajuan',
    example: 'Mendaftar sekolah',
    required: false,
  })
  @IsString()
  @Optional()
  keperluan?: string;
}
```

#### Update: `apps/api/src/public.controller.ts`

```typescript
import { SubmitComplaintDto, SubmitLetterDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('public')
@Controller('public')
export class PublicController {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService
  ) {}

  @Post('complaints')
  @ApiOperation({ summary: 'Submit a new complaint' })
  @ApiResponse({ status: 201, description: 'Complaint created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async submitComplaint(@Body() dto: SubmitComplaintDto) {
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant)
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);

    const aiAnalysis = await this.aiService.analyzeComplaint(dto.content);

    let residentId = null;
    if (dto.nik) {
      const resident = await this.prisma.resident.findFirst({
        where: { nik: dto.nik, tenantId: tenant.id },
      });
      if (resident) residentId = resident.id;
    }

    return this.prisma.complaint.create({
      data: {
        title: dto.title,
        content: dto.content,
        tenantId: tenant.id,
        residentId,
        metadata: aiAnalysis,
      },
    });
  }

  @Post('letters')
  @ApiOperation({ summary: 'Submit a new letter request' })
  @ApiResponse({ status: 201, description: 'Letter request created' })
  @ApiResponse({ status: 404, description: 'NIK not registered' })
  async submitLetter(@Body() dto: SubmitLetterDto) {
    const tenant = await this.prisma.tenant.findFirst();
    if (!tenant)
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);

    const resident = await this.prisma.resident.findFirst({
      where: { nik: dto.nik, tenantId: tenant.id },
    });
    if (!resident) {
      throw new HttpException(
        'NIK tidak terdaftar sebagai warga',
        HttpStatus.NOT_FOUND
      );
    }

    return this.prisma.letter.create({
      data: {
        type: dto.type,
        metadata: dto.keperluan ? { keperluan: dto.keperluan } : {},
        tenantId: tenant.id,
        residentId: resident.id,
      },
    });
  }
}
```

---

## 5. 🟡 TESTING & CI/CD (MEDIUM)

### 5.1 Add Test Configuration

#### Install packages:

```bash
npm install --save-dev jest @types/jest ts-jest @nestjs/testing
```

#### File: `jest.config.js` (ROOT - BUAT BARU)

```javascript
module.exports = {
  projects: [
    '<rootDir>/apps/api/jest.config.js',
  ],
};
```

#### File: `apps/api/jest.config.js` (BUAT BARU)

```javascript
module.exports = {
  displayName: 'api',
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.module.ts',
    '!**/index.ts',
  ],
};
```

#### File: `apps/api/src/public.controller.spec.ts` (BUAT BARU)

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { PublicController } from './public.controller';
import { PrismaService } from './prisma/prisma.service';
import { AiService } from './ai/ai.service';
import { SubmitComplaintDto } from './dto/submit-complaint.dto';

describe('PublicController', () => {
  let controller: PublicController;
  let prismaService: PrismaService;
  let aiService: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            tenant: { findFirst: jest.fn() },
            complaint: { create: jest.fn() },
            resident: { findFirst: jest.fn() },
          },
        },
        {
          provide: AiService,
          useValue: {
            analyzeComplaint: jest.fn().mockResolvedValue({
              priority: 'medium',
              category: 'Infrastruktur',
              summary: 'Aduan tentang kerusakan jalan',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<PublicController>(PublicController);
    prismaService = module.get<PrismaService>(PrismaService);
    aiService = module.get<AiService>(AiService);
  });

  describe('submitComplaint', () => {
    it('should submit complaint with AI analysis', async () => {
      const mockTenant = { id: 'tenant-1', name: 'Desa Test' };
      const mockComplaint = {
        id: 'complaint-1',
        title: 'Jalan rusak',
        content: 'Jalan di depan rumah rusak parah',
        tenantId: 'tenant-1',
        residentId: null,
        metadata: {
          priority: 'medium',
          category: 'Infrastruktur',
        },
      };

      prismaService.tenant.findFirst = jest.fn().mockResolvedValue(mockTenant);
      prismaService.complaint.create = jest.fn().mockResolvedValue(mockComplaint);

      const dto: SubmitComplaintDto = {
        title: 'Jalan rusak',
        content: 'Jalan di depan rumah rusak parah',
        nik: '1234567890123456',
      };

      const result = await controller.submitComplaint(dto);

      expect(result.id).toBe('complaint-1');
      expect(aiService.analyzeComplaint).toHaveBeenCalledWith(dto.content);
      expect(prismaService.complaint.create).toHaveBeenCalled();
    });

    it('should throw error if tenant not found', async () => {
      prismaService.tenant.findFirst = jest.fn().mockResolvedValue(null);

      const dto: SubmitComplaintDto = {
        title: 'Test',
        content: 'Test complaint',
      };

      await expect(controller.submitComplaint(dto)).rejects.toThrow();
    });
  });
});
```

#### Update: `package.json` (root)

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  }
}
```

### 5.2 Add GitHub Actions CI/CD Pipeline

#### File: `.github/workflows/test-and-build.yml` (BUAT BARU)

```yaml
name: Test & Build

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: sidpro_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup database
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/sidpro_test
        run: |
          cd packages/database
          npm run generate
          npx prisma db push --skip-generate
      
      - name: Run linter
        run: npm run lint || true
      
      - name: Run tests
        run: npm test
      
      - name: Build all workspaces
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3
      
      - uses: docker/setup-buildx-action@v2
      
      - uses: docker/build-push-action@v4
        with:
          context: .
          push: false
          tags: sidfree:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 6. 🟢 FRONTEND OPTIMIZATION (MEDIUM)

### 6.1 Enhanced Public Portal dengan Gemini Features

#### File: `apps/web-public/app/layanan/page.tsx` (BUAT BARU)

```typescript
'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function LayananPage() {
  const [formData, setFormData] = useState({
    nik: '',
    type: 'SKTM',
    keperluan: '',
  });
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTypeChange = async (e: any) => {
    const type = e.target.value;
    setFormData({ ...formData, type });
    
    // 🤖 Fetch AI template suggestion
    setLoading(true);
    try {
      const res = await fetch('/api/public/ai-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      setAiSuggestion(data.template);
    } catch (error) {
      console.error('Failed to fetch template:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/public/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setSuccess(true);
        setFormData({ nik: '', type: 'SKTM', keperluan: '' });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const error = await res.json();
        alert(`❌ Error: ${error.message}`);
      }
    } catch (error) {
      alert('❌ Terjadi kesalahan saat pengajuan');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Layanan Surat Desa</h1>
      <p className="text-gray-600 mb-8">Ajukan surat secara online dengan mudah dan cepat</p>
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-900">✅ Berhasil!</p>
            <p className="text-sm text-green-800">Surat Anda telah diajukan. Silakan tunggu konfirmasi melalui email.</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">NIK Anda</label>
          <input
            type="text"
            maxLength="16"
            pattern="[0-9]{16}"
            required
            value={formData.nik}
            onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan 16 digit NIK"
          />
          <p className="text-xs text-gray-500 mt-1">Format: 16 digit angka (cth: 1234567890123456)</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Jenis Surat</label>
          <select
            value={formData.type}
            onChange={handleTypeChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="SKTM">Surat Keterangan Tak Mampu (SKTM)</option>
            <option value="Domisili">Surat Keterangan Domisili</option>
            <option value="Pengantar">Surat Pengantar RT/RW</option>
            <option value="Keterangan Usaha">Surat Keterangan Usaha</option>
          </select>
        </div>

        {aiSuggestion && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-2">💡 Saran AI:</p>
                <p className="text-sm text-blue-800 leading-relaxed">{aiSuggestion}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Keperluan</label>
          <textarea
            value={formData.keperluan}
            onChange={(e) => setFormData({ ...formData, keperluan: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Jelaskan keperluan Anda (cth: Mendaftar sekolah, membuka usaha, dll)"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Ajukan Surat
            </>
          )}
        </button>
      </form>
    </div>
  );
}
```

---

## 7. 🟣 SECURITY & DATA PROTECTION (HIGH)

### 7.1 Add Input Sanitization

#### Install:

```bash
npm install --save xss
```

#### File: `apps/api/src/common/sanitize.interceptor.ts` (BUAT BARU)

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as xss from 'xss';

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    if (request.body) {
      request.body = this.sanitizeObject(request.body);
    }
    
    return next.handle();
  }

  private sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return xss(obj, {
        whiteList: {},
        stripIgnoredTag: true,
      });
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }
    
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] = this.sanitizeObject(obj[key]);
        return acc;
      }, {});
    }
    
    return obj;
  }
}
```

#### Update: `apps/api/src/main.ts`

```typescript
import { SanitizeInterceptor } from './common/sanitize.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalInterceptors(new SanitizeInterceptor());
  
  // ... rest of bootstrap
}
```

### 7.2 Add Rate Limiting

#### Install:

```bash
npm install --save @nestjs/throttler
```

#### Update: `apps/api/src/app.module.ts`

```typescript
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // Max 100 requests per minute
      },
    ]),
    // ... other imports
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
```

### 7.3 Add CORS Configuration

#### Update: `apps/api/src/main.ts`

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: [
      process.env.APP_URL || 'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600,
  });

  await app.listen(process.env.PORT || 3003);
}
```

---

## 8. 🔴 DEPLOYMENT PREPARATION (HIGH)

### 8.1 Create Dockerfile

#### File: `Dockerfile` (ROOT - BUAT BARU)

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build all workspaces
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.js ./server.js

# Set environment
ENV NODE_ENV=production
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Start application
CMD ["node", "server.js"]
```

### 8.2 Create `.dockerignore`

```
node_modules
npm-debug.log
.git
.env.local
.env.*.local
.next
dist
build
*.spec.ts
.gitignore
README.md
.github
coverage
```

### 8.3 Create `app.yaml` untuk Cloud Run

#### File: `app.yaml` (ROOT - BUAT BARU)

```yaml
runtime: nodejs18
env: flex
entrypoint: node server.js

env_variables:
  NODE_ENV: "production"
  PORT: "8080"
  LOG_LEVEL: "info"

automatic_scaling:
  min_instances: 1
  max_instances: 5
  cool_down_period_sec: 60
  cpu_utilization:
    target_utilization: 0.6

resources:
  cpu: 2
  memory_gb: 2
  disk_size_gb: 10
```

### 8.4 Create Cloud Build Config

#### File: `cloudbuild.yaml` (ROOT - BUAT BARU)

```yaml
steps:
  # Step 1: Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'gcr.io/$PROJECT_ID/sidpro:$SHORT_SHA'
      - '-t'
      - 'gcr.io/$PROJECT_ID/sidpro:latest'
      - '.'
    env:
      - 'DOCKER_BUILDKIT=1'

  # Step 2: Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'gcr.io/$PROJECT_ID/sidpro:$SHORT_SHA'

  # Step 3: Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/run'
    args:
      - 'deploy'
      - 'sidpro'
      - '--image'
      - 'gcr.io/$PROJECT_ID/sidpro:$SHORT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--set-env-vars'
      - 'GEMINI_API_KEY=${_GEMINI_API_KEY},DATABASE_URL=${_DATABASE_URL},NODE_ENV=production'
      - '--memory'
      - '2Gi'
      - '--cpu'
      - '2'
      - '--timeout'
      - '3600'
      - '--max-instances'
      - '5'

images:
  - 'gcr.io/$PROJECT_ID/sidpro:$SHORT_SHA'
  - 'gcr.io/$PROJECT_ID/sidpro:latest'

timeout: '1800s'

substitutions:
  _GEMINI_API_KEY: 'your-gemini-key'
  _DATABASE_URL: 'your-database-url'

options:
  machineType: 'N1_HIGHCPU_8'
  logging: CLOUD_LOGGING_ONLY
```

---

## 9. 🟢 DOCUMENTATION (MEDIUM)

### 9.1 Comprehensive README

#### File: `README.md` (ROOT - UPDATE/BUAT BARU)

```markdown
# 🏘️ SIDPRO - Sistem Informasi Desa

Aplikasi multi-tenant full-stack untuk administrasi dan layanan publik pemerintahan desa.

![Versi](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-18+-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-86%25-blue)

## ✨ Fitur Utama

- **📝 Manajemen Surat** - Pengajuan surat SKTM, domisili, pengantar online
- **🤖 AI-Powered** - Gemini API untuk template generation & sentiment analysis
- **👥 Database Warga** - Kelola penduduk, keluarga, dan dokumen
- **📊 Dashboard Admin** - Analytics dashboard untuk admin desa
- **💬 Sistem Aduan** - Warga dapat menyampaikan keluhan terstruktur
- **🔐 Multi-Tenant** - Isolated data per desa dengan role-based access
- **☁️ Cloud Native** - Siap deploy ke Google Cloud Run

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: NestJS 11
- **Database**: PostgreSQL 13+ (Prisma ORM)
- **API**: REST + OpenAPI/Swagger
- **AI**: Google Gemini 2.0 Flash API

### Frontend
- **Web Public**: Next.js 14 + React 18 + Tailwind CSS
- **Web Admin**: Next.js 14 + React 18 + Tailwind CSS
- **UI Components**: Lucide Icons + Custom components

### Deployment
- **Cloud**: Google Cloud Run
- **Container**: Docker
- **Database**: Cloud SQL (PostgreSQL)
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org))
- PostgreSQL 13+ atau Cloud SQL
- Google Cloud Account
- Gemini API Key ([Get key](https://aistudio.google.com/app/apikey))

### Local Development

\`\`\`bash
# 1. Clone repository
git clone https://github.com/arpayid/Sidfree.git
cd Sidfree

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local dengan kredensial Anda:
#   GEMINI_API_KEY=your_api_key
#   DATABASE_URL=postgresql://user:password@localhost/sidpro

# 4. Run migration script
chmod +x scripts/migrate-to-monorepo.sh
./scripts/migrate-to-monorepo.sh

# 5. Start development server
npm run dev
\`\`\`

### 🌐 Access Points

Setelah menjalankan `npm run dev`:

- **Public Portal**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **API Documentation**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Health Check**: [http://localhost:3000/health](http://localhost:3000/health)

## 📚 API Documentation

API docs tersedia di `/api/docs` saat menjalankan aplikasi lokal.

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/public/complaints` | Submit complaint |
| POST | `/api/public/letters` | Submit letter request |
| POST | `/api/public/ai-template` | Get AI template |

### Admin Endpoints

Memerlukan JWT authentication.

## 🐳 Docker Deployment

### Build Image

\`\`\`bash
docker build -t sidpro:latest .
\`\`\`

### Run Container

\`\`\`bash
docker run -p 8080:8080 \\
  -e GEMINI_API_KEY=your_key \\
  -e DATABASE_URL=postgresql://... \\
  -e NODE_ENV=production \\
  sidpro:latest
\`\`\`

## ☁️ Deploy to Google Cloud Run

### Prerequisites
- Google Cloud Project
- Cloud SQL instance (PostgreSQL)
- Container Registry enabled

### Steps

\`\`\`bash
# 1. Set environment variables
export PROJECT_ID="your-gcp-project"
export REGION="us-central1"

# 2. Build and push image
gcloud builds submit --tag gcr.io/$PROJECT_ID/sidpro

# 3. Deploy to Cloud Run
gcloud run deploy sidpro \\
  --image gcr.io/$PROJECT_ID/sidpro \\
  --platform managed \\
  --region $REGION \\
  --allow-unauthenticated \\
  --set-env-vars \\
    GEMINI_API_KEY=your_key,\\
    DATABASE_URL=postgresql://...,\\
    NODE_ENV=production \\
  --memory 2Gi \\
  --cpu 2 \\
  --max-instances 5
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Generate coverage report
npm test:cov
\`\`\`

## 📊 Project Structure

\`\`\`
Sidfree/
├── apps/
│   ├── api/                 # NestJS Backend
│   ├── web-admin/          # Admin Dashboard
│   └── web-public/         # Public Portal
├── packages/
│   └── database/           # Prisma ORM & Migrations
├── scripts/
│   └── migrate-to-monorepo.sh
├── .github/
│   └── workflows/          # CI/CD Pipeline
├── Dockerfile
├── server.js               # Express Proxy
└── package.json            # Root Monorepo
\`\`\`

## 📝 Environment Variables

### Required (Critical)
- `GEMINI_API_KEY` - Google Gemini API key
- `DATABASE_URL` - PostgreSQL connection string

### Optional
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 8080)
- `LOG_LEVEL` - Logging level (info/debug/warn/error)

## 🤝 Contributing

Kontribusi diterima! Silakan:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 License

Proyek ini dilisensikan di bawah MIT License - lihat [LICENSE](LICENSE) file untuk detail.

## 👨‍💻 Author

**Arpayid**
- GitHub: [@arpayid](https://github.com/arpayid)
- Repository: [SIDPRO](https://github.com/arpayid/Sidfree)

## 🆘 Support

Butuh bantuan?
- 📖 Baca [dokumentasi](./docs)
- 🐛 Report bug di [Issues](https://github.com/arpayid/Sidfree/issues)
- 💬 Diskusi di [Discussions](https://github.com/arpayid/Sidfree/discussions)

## 🙏 Acknowledgments

- Google Gemini API untuk AI features
- NestJS community
- Next.js team
- Prisma untuk ORM

---

**Made with ❤️ for Indonesian Villages**
```

---

## ✅ IMPLEMENTATION CHECKLIST

| # | Task | Priority | Effort | Impact | Status |
|---|------|----------|--------|--------|--------|
| 1 | Implement Gemini AI integration | 🔴 CRITICAL | 4h | HIGH | ⬜ TODO |
| 2 | Add input validation DTOs & Swagger | 🔴 CRITICAL | 3h | MEDIUM | ⬜ TODO |
| 3 | Add health check endpoints | 🔴 CRITICAL | 1h | HIGH | ⬜ TODO |
| 4 | Cloud SQL config validation | 🟠 HIGH | 2h | HIGH | ⬜ TODO |
| 5 | Dockerfile & Cloud Run setup | 🟠 HIGH | 2h | HIGH | ⬜ TODO |
| 6 | Rate limiting & CORS security | 🟠 HIGH | 2h | MEDIUM | ⬜ TODO |
| 7 | Consolidate patch files → migration script | 🟡 MEDIUM | 3h | MEDIUM | ⬜ TODO |
| 8 | Add unit tests (public controller) | 🟡 MEDIUM | 4h | MEDIUM | ⬜ TODO |
| 9 | GitHub Actions CI/CD pipeline | 🟡 MEDIUM | 2h | MEDIUM | ⬜ TODO |
| 10 | Comprehensive documentation | 🟡 MEDIUM | 3h | MEDIUM | ⬜ TODO |

---

## 🎯 RECOMMENDED IMPLEMENTATION TIMELINE

### **Week 1: Foundation & AI Integration**

**Monday-Tuesday: Prioritas 1 & 2**
- Implement Gemini AI Service
- Add DTOs & Swagger documentation
- Estimated: 7 hours

**Wednesday-Thursday: Prioritas 3 & 4**
- Add health check endpoints
- Validate Cloud SQL configuration
- Estimated: 3 hours

**Friday: Testing & Review**
- Test all implementations
- Documentation review
- Estimated: 2 hours

### **Week 2: Deployment & Security**

**Monday-Tuesday: Prioritas 5 & 6**
- Create Dockerfile & Cloud Run config
- Add rate limiting & CORS security
- Estimated: 4 hours

**Wednesday-Thursday: Prioritas 7 & 8**
- Consolidate patchfiles
- Add unit tests
- Estimated: 7 hours

**Friday: CI/CD Setup**
- Setup GitHub Actions pipeline
- Testing & refinement
- Estimated: 2 hours

### **Week 3: Documentation & Beta Deployment**

**Monday-Friday: Prioritas 9 & 10**
- Write comprehensive documentation
- Create deployment guides
- Beta testing
- Production deployment
- Estimated: 15 hours

---

## 🚀 QUICK START COMMAND REFERENCE

```bash
# Development
npm install
npm run dev

# Testing
npm test
npm test:watch
npm test:cov

# Building
npm run build

# Docker
docker build -t sidpro .
docker run -p 8080:8080 sidpro

# Database
cd packages/database
npm run generate
npx prisma db push
npm run seed

# Migration
chmod +x scripts/migrate-to-monorepo.sh
./scripts/migrate-to-monorepo.sh
```

---

## 📞 SUPPORT & CONTACT

Untuk bantuan lebih lanjut atau pertanyaan:
- 📧 Email: arpayid@example.com
- 🐙 GitHub: https://github.com/arpayid/Sidfree
- 📋 Issues: https://github.com/arpayid/Sidfree/issues

---

**Dokumen ini merupakan rekomendasi komprehensif untuk production deployment Sidfree di Google AI Studio.**

**Versi**: 1.0  
**Last Updated**: 5 Juli 2026  
**Status**: Ready for Implementation
