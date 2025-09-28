import { eq } from "drizzle-orm";
import { User } from "src";
import { db } from "src/lib/db";
import { feed } from "src/schema";

export async function deleteFeed(user:User,feed_url:string) {
    if(!user){
        throw new Error(`user not logged in`)
    }
    return db.delete(feed).where(eq(feed.url,feed_url));
    
}