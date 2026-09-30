import { prisma } from '@/lib/db';

async function main() {
  const posts = await prisma.communityPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } } },
  });

  console.log('=== POSTS:', posts.length, '===\n');

  for (const post of posts) {
    console.log(
      [
        post.id.slice(0, 8),
        '|',
        post.user.name,
        '|',
        post.category,
        '|',
        post.country,
        '/',
        post.activity,
        '|',
        JSON.stringify(post.title),
        '| image:',
        post.image ? 'yes' : 'no',
        '|',
        post.createdAt.toISOString(),
      ].join(' ')
    );
  }

  const byTitle = new Map<string, number>();
  for (const post of posts) {
    const key = `${post.country}|${post.activity}|${post.title}`;
    byTitle.set(key, (byTitle.get(key) ?? 0) + 1);
  }

  console.log('\n=== DUPLICATES ===');
  let found = false;
  for (const [key, count] of byTitle) {
    if (count > 1) {
      found = true;
      console.log(` x${count}  ${key}`);
    }
  }
  if (!found) console.log('none');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error('ERR', error.message);
    await prisma.$disconnect();
    process.exit(1);
  });
