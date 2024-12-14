import { db } from './index';
import { comments, users } from './schema';
import { eq } from 'drizzle-orm';
import type { Comment } from './types';

export async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  const results = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      authorId: comments.authorId,
      authorName: users.name,
    })
    .from(comments)
    .leftJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.postId, postId))
    .all();

  return results;
}

export async function createComment(data: {
  content: string;
  postId: number;
  authorId: string;
}): Promise<void> {
  await db.insert(comments).values(data);
}