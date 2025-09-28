import { desc } from "drizzle-orm";
import { db } from "src/lib/db";
import { posts } from "src/schema";
export interface Post {
    title:string,
    url:string
    description?:string,
    publishedAt?:Date,
    feed_id:string
}
export async function createPost(post:Post) {
    const res = await db.insert(posts).values({
        title:post.title,
        url:post.url,
        description:post.description,
        publishedAt:post.publishedAt,
        feed_id:post.feed_id
    })
    return res;
}
export async function getPostsForUser(limitCount:number) {
    const res = await db
    .select({
      id: posts.id,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedId: posts.feed_id,
    })
    .from(posts)
    .orderBy(desc(posts.publishedAt))
    .limit(limitCount);
    return res;
}