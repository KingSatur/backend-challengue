import { PrismaClient } from '@prisma/client';
import { USERS } from './data/users';

const prisma = new PrismaClient();

async function main() {
  await Promise.all(
    USERS.map((user) => {
      return prisma.user.upsert({
        where: {
          email: user?.email,
        },
        create: user,
        update: user,
      });
    }),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Successfully seeded database');
    await prisma.$disconnect();
  });
