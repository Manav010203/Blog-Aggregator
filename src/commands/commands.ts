import { UserCommandHandler } from "src";
import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
): void {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }
  

  await handler(cmdName, ...args);
}

export const middlewareLoggedIn = (handler:UserCommandHandler):CommandHandler=>{
return async(cmdName:string,...args:string[])=>{
  const config = readConfig();
  if(!config){
    throw new ErrorEvent("not logged in");
  }
  const users = await getUser(config.currentUserName);
  if(users.length ===0){
    throw new Error(`user not found`);
  }
  const user = users[0];
  await handler(cmdName,user,...args);
}
}