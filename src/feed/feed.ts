import { XMLParser } from "fast-xml-parser";
import { Agent } from "http";
interface RSS {
    title:string;
    link:string;
    description:string;
    item:RSSItem[] | null;
}
interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

export async function fetchFeed(feedURL:string) {
    const res = await fetch(feedURL,{
        headers :
        {"User-Agent":"gator"}
    });
    const xml_data = await res.text();
    const parser = new XMLParser();
    const jvObject = parser.parse(xml_data);
    const channel = jvObject.rss?.channel;
    if(!channel){
        throw new Error(`channel field doesnot exist in javascript object`);
    }
    if(!channel.title||
       !channel.link||
       !channel.description
    ){
    throw new Error(`donot have title,link,description field in channel`);
    }
    
    const title = channel.title;
    const link = channel.link
    const description = channel.description
    if(channel.item && !Array.isArray(channel.item)){
        channel.item = [];
    }
    const validItems : RSSItem[] = [];
    for(const item of channel.item){
        if (
      typeof item.title === "string" &&
      typeof item.link === "string" &&
      typeof item.description === "string" &&
      typeof item.pubDate === "string"
    ) {
      validItems.push({
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,
      });
    } else {
      // skip invalid item
      console.warn("Skipping invalid RSS item:", item);
    }
    }
    const rssObject: RSS = {
  title: title,
  link: link,
  description: description,
  item: validItems.length > 0 ? validItems : null
};
    return rssObject;
}
