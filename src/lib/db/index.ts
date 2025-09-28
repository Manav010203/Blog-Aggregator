import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../../schema";
import { readConfig } from "../../config";

const config = readConfig();
const conn = postgres(config.dbUrl);
export const db = drizzle(conn, { schema });


export async function closeDb() {
  await conn.end(); // important for CLI scripts
}