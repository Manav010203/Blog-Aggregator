
import { eq } from "drizzle-orm";
import { readConfig } from "src/config";
import { db } from "src/lib/db";
import { getUser } from "src/lib/db/queries/users";
import { feed_follows, feed, users } from "src/schema";

export async function createFeedFollow(user_id: string, feed_id: string) {
  // Insert the feed follow record
  const [follow] = await db
    .insert(feed_follows)
    .values({ user_id, feed_id })
    .returning();

  // Select the full record with user and feed names
  const [full] = await db
    .select({
      followId: feed_follows.id,
      createdAt: feed_follows.createdAt,
      username: users.name,
      feedName: feed.name,   // ✅ using correct table name
      feedUrl: feed.url,     // ✅ using correct table name
    })
    .from(feed_follows)
    .where(eq(feed_follows.id, follow.id))
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .innerJoin(feed, eq(feed_follows.feed_id, feed.id));

  return full;
}
export async function getFeedFollowsForUser(user_id:string) {
  const usersi = await readConfig();
  const user = await getUser(usersi.currentUserName);
    const res = await db
    .select({
      followId: feed_follows.id,
      username: users.name,
      feedName: feed.name,
      feedUrl: feed.url,
      createdAt: feed_follows.createdAt,
    })
    .from(feed_follows)
    .innerJoin(users, eq(feed_follows.user_id, users.id))
    .innerJoin(feed, eq(feed_follows.feed_id, feed.id))
    .where(eq(feed_follows.user_id, user[0].id));
    return res;
}
async function feedid_name(feed_id:string) {
    const [res] = await db.select().from(feed).where(eq(feed.id,feed_id));
    return res;
}
export async function getFollowing() {
  const users = readConfig();
  const [user] = await getUser(users.currentUserName);
   if (!user) {
    throw new Error("Current user not found");
  }
  const res = await getFeedFollowsForUser(user.id);
  for(const item of res){
    console.log(item.feedName);
    console.log(item.username);
  }
}