const fs = require('fs');

let code = fs.readFileSync('packages/database/seed.ts', 'utf8');

code = code.replace(/await prisma\.role\.create\(\{/g, "await prisma.role.upsert({ where: { id: 'dummy_id_replace_later' }, update: {}, create: {");
code = code.replace(/await prisma\.tenant\.create\(\{/g, "await prisma.tenant.upsert({ where: { id: 'dummy_id_replace_later' }, update: {}, create: {");
code = code.replace(/await prisma\.user\.create\(\{/g, "await prisma.user.upsert({ where: { email: 'admin@sukamaju.desa.id' }, update: {}, create: {");
code = code.replace(/await prisma\.family\.create\(\{/g, "await prisma.family.upsert({ where: { kkNumber: '3271123456780010' }, update: {}, create: {");
code = code.replace(/await prisma\.resident\.create\(\{/g, "await prisma.resident.upsert({ where: { nik: '3271123456780001' }, update: {}, create: {");

// Wait, upsert needs unique identifier.
// Actually, it's easier to just do upsert properly. Let's rewrite it.
