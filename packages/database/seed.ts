import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const superAdminRole = await prisma.role.findFirst({ where: { name: 'Super Admin' } }) || await prisma.role.create({
    data: {
      name: 'Super Admin',
      permissions: JSON.stringify(['*']),
    }
  });

  const adminDesaRole = await prisma.role.findFirst({ where: { name: 'Admin Desa' } }) || await prisma.role.create({
    data: {
      name: 'Admin Desa',
      permissions: JSON.stringify(['read:resident', 'write:resident', 'read:letter', 'write:letter', 'read:complaint', 'write:complaint']),
    }
  });

  const tenant = await prisma.tenant.findFirst({ where: { name: 'Desa Sukamaju' } }) || await prisma.tenant.create({
    data: {
      name: 'Desa Sukamaju',
    }
  });

  const hash = await bcrypt.hash('password123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@sukamaju.desa.id' },
    update: {
      password: hash,
      roleId: adminDesaRole.id,
    },
    create: {
      email: 'admin@sukamaju.desa.id',
      password: hash,
      name: 'Admin Desa Sukamaju',
      tenantId: tenant.id,
      roleId: adminDesaRole.id,
    }
  });
  
  const family = await prisma.family.findFirst({ where: { kkNumber: '3271123456780010' } }) || await prisma.family.create({
    data: {
      tenantId: tenant.id,
      kkNumber: '3271123456780010',
      address: 'Jl. Merdeka No. 42',
      rt: '01',
      rw: '02',
    }
  });

  const resident = await prisma.resident.findFirst({ where: { nik: '3271123456780001' } }) || await prisma.resident.create({
    data: {
      tenantId: tenant.id,
      nik: '3271123456780001',
      name: 'Budi Santoso',
      familyId: family.id,
      status: 'Aktif',
    }
  });

  console.log('Seed completed!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
