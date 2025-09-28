import { db } from "src/lib/db";
import { feed, posts } from "src/schema";
import { eq, sql } from "drizzle-orm";
import { getfeedusingUrl } from "src/lib/db/queries/users";
import { fetchFeed } from "./feed";

export async function markFeedFetched (feed_id:string) {
    const res = await db.update(feed).set({
        lastfetchedAt:new Date(),
        updatedAt:new Date()
    }).where(eq(feed.id,feed_id));

}
export async function getNextFeedToFetch() {
    const [nextFeed] = await db
    .select()
    .from(feed)
    // ORDER BY last_fetched_at ASC NULLS FIRST
    .orderBy(sql`"last_fetched_at" ASC NULLS FIRST`)
    .limit(1);

  return nextFeed;
}
// export async function scrapeFeed() {
//     const  nextFeed = await getNextFeedToFetch();
//     const markedfetched =await markFeedFetched(nextFeed.id);
//     const feed= getfeedusingUrl(nextFeed.url);
//     for(const item in feed){
//         console.log(`${item}`);
//     }
// }
export async function scrapeFeed() {

  const nextFeed = await getNextFeedToFetch();

  await markFeedFetched(nextFeed.id);

  const feedData = await fetchFeed(nextFeed.url); 
  if (!feedData.item || feedData.item.length === 0) {
    console.log(`No items found for feed: ${nextFeed.name}`);
    return;
  }
  for(const item of feedData.item){
    let publishedAt:Date | null = null;
    if(item.pubDate){
        const date = new Date(item.pubDate);
        if(!isNaN(date.getTime())){
            publishedAt = date;
        }
    }
    try{
        await db.insert(posts).values({
            title:item.title,
            url:item.link,
            description:item.description,
            publishedAt,
            feed_id:nextFeed.id
        }).onConflictDoNothing()
    }catch(err){
        console.error(`Fasiled to insert into posts${item.title}`,err);
    }
  }
  console.log(`Saved ${feedData.item.length} posts from feed ${nextFeed.name}`);
}
