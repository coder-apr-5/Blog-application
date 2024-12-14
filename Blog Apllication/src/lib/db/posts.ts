import { db } from './index';
import { posts, postTags, tags } from './schema';
import { eq, like } from 'drizzle-orm';
import type { Post } from './types';

export async function getAllPosts(): Promise<Post[]> {
  return db.select().from(posts).all();
}

export async function createPost(data: {
  title: string;
  content: string;
  authorId: string;
  tags?: string[];
}): Promise<void> {
  const { tags: tagNames, ...postData } = data;
  
  const result = await db.insert(posts).values(postData).returning({ id: posts.id });
  const postId = result[0].id;
  
  if (tagNames?.length) {
    for (const tagName of tagNames) {
      const [tag] = await db
        .insert(tags)
        .values({ name: tagName })
        .onConflictDoUpdate({ target: tags.name, set: { name: tagName } })
        .returning({ id: tags.id });
      
      await db.insert(postTags).values({ postId, tagId: tag.id });
    }
  }
}

export async function getPostById(id: number): Promise<Post | undefined> {
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .get();

  if (!post) return undefined;

  const postTags = await db
    .select({ name: tags.name })
    .from(tags)
    .innerJoin(postTags, eq(tags.id, postTags.tagId))
    .where(eq(postTags.postId, id))
    .all();

  return {
    ...post,
    tags: postTags.map(tag => tag.name),
  };
}

export async function searchPosts(query: string): Promise<Post[]> {
  return db
    .select()
    .from(posts)
    .where(like(posts.title, `%${query}%`))
    .orWhere(like(posts.content, `%${query}%`))
    .all();
}