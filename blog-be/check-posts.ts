import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: {
      isDeleted: false,
      isDraft: false,
      isActive: true,
    },
    select: {
      title: true,
      content: true,
    },
    take: 5,
  });

  console.log('--- Published Posts in DB ---');
  posts.forEach((p, i) => {
    console.log(`${i + 1}. Title: ${p.title}`);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
