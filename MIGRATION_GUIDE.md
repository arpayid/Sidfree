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
- 📊 Admin Dashboard: http://localhost:3000/admin
- 📚 API Docs: http://localhost:3000/api/docs
- ⚙️ API: http://localhost:3000/api
