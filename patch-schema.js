const fs = require('fs');
let code = fs.readFileSync('packages/database/prisma/schema.prisma', 'utf8');

// Update Tenant
code = code.replace(/auditLogs  AuditLog\[\]\n}/, `auditLogs  AuditLog[]\n  payments   Payment[]\n  businesses Business[]\n}`);

// Update Resident
code = code.replace(/letters    Letter\[\]\n}/, `letters    Letter[]\n  payments   Payment[]\n  businesses Business[]\n}`);

// Update Letter
code = code.replace(/metadata  Json\?    \/\/ Specific data for the letter type/, `metadata  Json?    // Specific data for the letter type\n\n  signature String?  // Digital signature\n  qrCode    String?  // QR code tracking ID`);

// Add new models
code += `

model Payment {
  id        String   @id @default(uuid())
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  
  residentId String
  resident   Resident @relation(fields: [residentId], references: [id])
  
  amount    Float
  type      String   // Iuran Sampah, Air, Keamanan
  status    String   @default("Pending") // Pending, Success, Failed
  reference String?  // Payment gateway reference
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Business {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  
  residentId  String
  resident    Resident @relation(fields: [residentId], references: [id])
  
  name        String
  description String?
  category    String   // Makanan, Kerajinan, Jasa
  contact     String?
  imageUrl    String?
  
  status      String   @default("Active") // Active, Inactive
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
`;

fs.writeFileSync('packages/database/prisma/schema.prisma', code);
