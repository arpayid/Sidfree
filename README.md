# 🏛️ SIDPRO - Sistem Informasi Desa
Aplikasi multi-tenant full-stack untuk administrasi dan layanan publik pemerintahan desa.

![Versi](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-18+-brightgreen)

## ✨ Fitur Utama
- **📝 Manajemen Surat** - Pengajuan surat SKTM, domisili, pengantar online
- **🤖 AI-Powered** - Gemini API untuk template generation & sentiment analysis
- **👥 Database Warga** - Kelola penduduk, keluarga, dan dokumen
- **📊 Dashboard Admin** - Analytics dashboard untuk admin desa
- **📢 Sistem Aduan** - Warga dapat menyampaikan keluhan terstruktur
- **🏢 Multi-Tenant** - Isolated data per desa dengan role-based access
- **☁️ Cloud Native** - Siap deploy ke Google Cloud Run

## 🛠️ Tech Stack
### Backend
- **Runtime**: Node.js 18+
- **Framework**: NestJS 11
- **Database**: PostgreSQL 13+ (Prisma ORM)
- **API**: REST + OpenAPI/Swagger
- **AI**: Google Gemini 2.5 Flash API

### Frontend
- **Web Public**: Next.js 14 + React 18 + Tailwind CSS
- **Web Admin**: Next.js 14 + React 18 + Tailwind CSS
- **UI Components**: Lucide Icons + Custom components

### Deployment
- **Cloud**: Google Cloud Run
- **Container**: Docker
- **Database**: Cloud SQL (PostgreSQL)

## 🚀 Quick Start
### Prerequisites
- Node.js 18+
- PostgreSQL 13+ atau Cloud SQL
- Gemini API Key

### Local Development
\`\`\`bash
# 1. Install dependencies
npm install

# 2. Configure environment variables in .env

# 3. Run migration script (opsional untuk setup lengkap)
./scripts/migrate-to-monorepo.sh

# 4. Start development server
npm run dev
\`\`\`

## 📚 API Documentation
API docs tersedia di `/api/docs` saat menjalankan aplikasi lokal.

---
**Made with ❤️ for Indonesian Villages**
