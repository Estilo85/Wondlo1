import { prisma } from '@/lib/db';

async function main() {
  const posts = await prisma.communityPost.findMany({
    orderBy: { createdAt: 'asc' },
    include: { likes: true, comments: true },
  });

  console.log('Total posts:', posts.length);

  const groups = new Map<string, typeof posts>();
  for (const post of posts) {
    const key = `${post.userId}|${post.title}|${post.body}|${post.country}|${post.activity}`;
    const list = groups.get(key) ?? [];
    list.push(post);
    groups.set(key, list);
  }

  let deleted = 0;

  for (const [, list] of groups) {
    if (list.length < 2) continue;

    const [keep, ...remove] = list;

    console.log(
      `\nGroup of ${list.length}: "${keep.title}" - keeping ${keep.id.slice(0, 8)}`
    );

    for (const post of remove) {
      console.log(
        `  removing ${post.id.slice(0, 8)} (likes: ${post.likes.length}, comments: ${post.comments.length})`
      );
      await prisma.communityPost.delete({ where: { id: post.id } });
      deleted += 1;
    }
  }

  console.log('\nRemoved', deleted, 'duplicate post(s).');
  console.log('Posts remaining:', await prisma.communityPost.count());
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error('ERR', error.message);
    await prisma.$disconnect();
    process.exit(1);
  });
