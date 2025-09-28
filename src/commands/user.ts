import { createUser, deleteAllUsers, getfeedusingUrl, getUser, getUsers } from "src/lib/db/queries/users";
import { readConfig, setUser } from "../config";
import { fetchFeed } from "src/feed/feed";
import { createFeed, getFeedsWithUser } from "src/feed/createFeed";
import { createFeedFollow, getFeedFollowsForUser } from "src/feed/createFeedFollow";
import { User } from "src";
import { deleteFeed } from "src/feed/deletFeed";
import { parseDuration } from "./extrafunction";
import { scrapeFeed } from "src/feed/feedtofetch";
import { createPost, getPostsForUser, Post } from "src/posts/createpost";
import { number } from "zod";

export async function handlerLogin(cmdName: string,user:User, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  // const user = await getUser(userName);
  // if(user.length ===0){
  //   throw new Error(`User not found`);
  // }
  setUser(userName);
  console.log("User switched successfully!");
}
export async function handlerRegister(cmdName:string,...args:string[]) {
    if(args.length !==1){
        throw new Error (`command name or user not given`);
    }
    const userName = args[0];
    const user = await createUser(userName);
   
    if(!user){
        throw new Error(`User ${userName} not found`); 
    }
    setUser(user.name);
    console.log(`user was Created`);
}
export async function handlerReset(cmdName:string,user:User) {
  const res = await deleteAllUsers();
  if(!res){
    throw new Error(`unable to do `);
  }
  console.log(`Table is empty now.`)
  
}
// export async function handlergetUser() {
//   const res = await getUsers();
//   for(let i =res.length-1;i>=0;i--){
//     if(i===res.length-1){
//       console.log(`* ${res[i]} (current)`);
//     }
//     else{
//     console.log(`* ${res[i]}`);
//     }
//   }
  
// }
export async function handlerListUsers(_: string,user:User) {
  const users = await getUsers();
  const config = readConfig();

  for (let user of users) {
    if (user.name === config.currentUserName) {
      console.log(`* ${user.name} (current)`);
      continue;
    }
    console.log(`* ${user.name}`);
  }
}
export async function handlerAgg(cmdName:string,...args:string[]) {
  const url = "https://www.wagslane.dev/index.xml"
  const resp = await fetchFeed(url);
  console.log(resp)
  if(args.length===0){
    throw new Error(`give proper arguments for time in args command`);
  }
  const time_String = args[0];
  const time_between_reps = await parseDuration(time_String);
  console.log(`Collecting feeds every ${time_between_reps}`);
  scrapeFeed().catch(console.error);

const interval = setInterval(() => {
  scrapeFeed().catch(console.error);
}, time_between_reps);
await new Promise<void>((resolve) => {
  process.on("SIGINT", () => {
    console.log("Shutting down feed aggregator...");
    clearInterval(interval);
    resolve();
  });
});
}
// export async function handleraddFeed(name:string,url:string) {
//   const config = readConfig();
//   const userslist = await getUser(config.currentUserName)
//    if (userslist.length === 0) {
//     throw new Error("User not logged in");
//   }
//   const user = userslist[0];
//   const newFeed = await createFeed(name,url,user.id);
//   console.log(`Feed ${newFeed.name} added by ${user.name}`);
// }
export async function handleraddFeed(cmdName:String,user:User,...args:string[]) {
  if(args.length !==2){
    throw new Error(`usage: ${cmdName} <name> <url>`);
  }
  const [feedName,feedURL] = args;

  const config = readConfig();
  const userList = await getUser(config.currentUserName);

  if(userList.length === 0){
    throw new Error("user not found");
  }
  // const user = userList[0];

  const newFeed = await createFeed(feedName,feedURL,user.id);
  // await createFeedFollow(user.id,newFeed.id);
  console.log(`Feed ${feedName} added by ${user.name}`)
  const post :Post = {
    title:newFeed.name,
    url:newFeed.url,
    feed_id:newFeed.id,
    publishedAt:newFeed.createdAt,
  }
  const addpost = await createPost(post)
  console.log(`post has been created as well `)
  
}

export async function handlerFeed() {
  const res = await getFeedsWithUser();
  for(const feed of res){
  console.log(feed.feedName);
  console.log(feed.feedUrl);
  console.log(feed.userName);
}
}
export async function handlerFollow(cmdName:string,user:User,...args:string[]) {
  
  if(args.length === 0){
    throw new Error(`pass proper argument for follow`);
  }
  // const current_user = readConfig();
  // const users = await getUser(current_user.currentUserName);
  // if(users.length === 0){
  //   throw new Error("No record found / user not found");
  // }
  // const user = users[0];
  const feeds = await getfeedusingUrl(args[0]);
  if(feeds.length === 0){
    throw new Error('feed not found');
  }
  const feed = feeds[0];
  const follow = await createFeedFollow(user.id,feed.id);
  console.log(`${follow.feedName} followed by ${follow.username}`);
  
}

export async function handleFollowing() {
  const conffig  = readConfig();
  const user = await getUser(conffig.currentUserName);
  if(!user){
    throw new Error(`User not found`);
  }
  const res = await getFeedFollowsForUser(user[0].id);
  console.log(res);
}

export async function handlerUnfollow(cmdName:string,user:User,...args:string[]) {
  if(args.length===0){
    throw new Error("pass proper argument");
  }
  if(!user){
    throw new Error("user not logged in");
  }
  const feedurl = args[0];
  const res = await deleteFeed(user,feedurl);
  console.log(`unfollowed successfully ${feedurl}`);
  
}

export async function handleBrowse(cmdName:String,...args:string[]) {
  if(args.length===0){
    throw new Error(`passed correct arguments wiht comand`);
  }
  const limit = parseInt(args[0],10)
  if (isNaN(limit)) throw new Error(`Limit must be a number, got "${args[0]}"`);

  const res = await getPostsForUser(limit);
  console.log(res);

}