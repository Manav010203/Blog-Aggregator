import fs from "fs";
import os from "os";
import path from "path";
import { any } from "zod";
export type Config ={
dbUrl:string,
currentUserName:string
}

export function setUser(name:string){
const cfg = readConfig();
const updated:Config = {...cfg,currentUserName:name};
writeConfig(updated);
// return updated;
}


export function readConfig():Config{
const raw = fs.readFileSync(getConfigPath(),"utf-8");
const json = validateConfig(JSON.parse(raw));
return json;
}
function getConfigPath():string{
// const configPath = path.join(
//   os.homedir(),
//   "Desktop/workspace/github/blog_aggregator/~/.gatorconfig.json"
// /Users/manavdeepsingh/.gatorconfig.json
const configPath = path.join(
  os.homedir(),
  ".gatorconfig.json"
);
return configPath;
}
function writeConfig(cfg:Config):void{

const data = {
    db_url:cfg.dbUrl,
    current_user_name:cfg.currentUserName
};
fs.writeFileSync(getConfigPath(),JSON.stringify(data,null,2),"utf-8");
}


function validateConfig(rawConfig: any) {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("db_url is required in config file");
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name is required in config file");
  }

  const config: Config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };

  return config;
}
