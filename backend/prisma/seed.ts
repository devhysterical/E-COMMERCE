import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);

  // Tạo Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      fullName: 'System Administrator',
      role: 'ADMIN',
    },
  });

  console.log('Seed Admin Created:', admin.email);

  // Tạo Categories mẫu
  const categories = [
    { name: 'Laptop', description: 'Máy tính xách tay cấu hình cao' },
    { name: 'Smartphone', description: 'Điện thoại thông minh đời mới' },
    { name: 'Accessories', description: 'Phụ kiện điện tử chính hãng' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
