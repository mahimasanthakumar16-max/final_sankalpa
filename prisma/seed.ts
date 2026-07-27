import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@sankalpa.care';
  
  // Check if admin exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('SankalpaAdmin2026!', 10);
    await prisma.admin.create({
      data: {
        email,
        name: 'Mahima Admin',
        passwordHash,
      },
    });
    console.log('✅ Default admin seeded successfully:');
    console.log(`   Email: ${email}`);
    console.log('   Password: SankalpaAdmin2026!');
  } else {
    console.log('ℹ️ Admin already exists in database.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
