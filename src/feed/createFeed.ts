import { eq } from "drizzle-orm";
import { db } from "src/lib/db";
import { getUser } from "src/lib/db/queries/users";
import { feed, users } from "src/schema";
interface user {
    id:string;
    createdAt: Date;
    updatedAt: Date;
    name: string;

}
export type Feed = typeof feed.$inferSelect; // feeds is the table object in schema.ts

export async function createFeed(name:string,
    url:string,
    user_id:string) {
    const result = await db
        .insert(feed)
        .values({
            name: name,
            url: url,
            user_id: user_id,
        })
        .onConflictDoNothing({
            target: feed.url // Specify that the conflict resolution is for the 'url' column
        })
        .returning();
    const [newFeed] = result;
    
    return newFeed || null;
}
export async function printFeed(feed:Feed,user:Feed) {
    console.log(feed);
    console.log(user);
}
export async function getFeeds() {
    const res = await db.select().from(feed);
    return res;
}

export async function getFeedsWithUser() {
  const res = await db
    .select({
      feedId: feed.id,
      feedName: feed.name,
      feedUrl: feed.url,
      userId: users.id,
      userName: users.name,
    })
    .from(feed)
    .innerJoin(users, eq(feed.user_id, users.id));

  return res;
}
export async function  getFeedWithID(feed_id:string) {
  const res= await db.select().from(feed).where(eq(feed.id,feed_id))
  return res;
}

