import {
  CommandHandler,
  CommandsRegistry,
  middlewareLoggedIn,
  registerCommand,
  runCommand,
} from "./commands/commands";
import { handleFollowing, handleraddFeed, handlerFeed, handlerAgg,  handlerFollow,  handlerListUsers,  handlerLogin, handlerRegister, handlerReset, handlerUnfollow, handleBrowse } from "./commands/user";
export type User = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type MiddlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", middlewareLoggedIn(handlerLogin));//ok
  registerCommand(commandsRegistry, "register",handlerRegister);//ok
  registerCommand(commandsRegistry,"reset",middlewareLoggedIn(handlerReset));//ok
  registerCommand(commandsRegistry,"users",middlewareLoggedIn(handlerListUsers));//ok
  registerCommand(commandsRegistry,"agg",handlerAgg);//ok
  registerCommand(commandsRegistry,"addfeed",middlewareLoggedIn(handleraddFeed));//ok
  registerCommand(commandsRegistry,"feeds",handlerFeed);//ook
  registerCommand(commandsRegistry,"follow",middlewareLoggedIn(handlerFollow));//ok
  registerCommand(commandsRegistry,"following",
    handleFollowing
  )//ok
  registerCommand(commandsRegistry,"unfollow",middlewareLoggedIn(handlerUnfollow))//ok
  registerCommand(commandsRegistry,"browse",handleBrowse)//ok
  try {
   await runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();
