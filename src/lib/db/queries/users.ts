import { eq } from "drizzle-orm";
import { db } from "..";
import { feed, users } from "../../../schema";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}
export async function getUser(name:string) {
    const res = await db.select().from(users).where(eq(users.name, name))
    return res;
}
export async function deleteAllUsers() {
 const res = await db.delete(users).returning();
  return res;
}

export async function getUsers() {
  return db.select().from(users);
}

export async function  getfeedusingUrl(url:string) {
  return db.select().from(feed).where(eq(feed.url,url))
}