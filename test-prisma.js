const { PrismaClient } = require('./node_modules/.prisma/client/index.js');
const prisma = new PrismaClient();
prisma.$connect().then(() => {
  console.log('Connected');
  process.exit(0);
}).catch(console.error);
