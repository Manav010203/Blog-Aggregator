
// // import { table } from "console";
// // import { pgTable, timestamp, uuid, text,serial,integer, unique } from "drizzle-orm/pg-core";

// // export const users = pgTable("users", {
// //   id: uuid("id").primaryKey().defaultRandom().notNull(),
// //   createdAt: timestamp("created_at").notNull().defaultNow(),
// //   updatedAt: timestamp("updated_at")
// //     .notNull()
// //     .defaultNow()
// //     .$onUpdate(() => new Date()),
// //   name: text("name").notNull().unique(),
// // });
// // export const feed = pgTable("feed", {
// //   id: serial("id").primaryKey(),
// //   createdAt: timestamp("created_at").defaultNow().notNull(),
// //   updatedAt: timestamp("updated_at").defaultNow().notNull(),
// //   name: text("name").notNull(),
// //   url: text("url").notNull().unique(),
// //   user_id: uuid("user_id")
// //     .notNull()
// //     .references(() => users.id, { onDelete: "cascade" })
// // });

// // export const feed_follows = pgTable("feed_follows",{
// //   id: serial("id").primaryKey(),
// //   createdAt: timestamp("created_at").defaultNow().notNull(),
// //   updatedAt: timestamp("updated_at").defaultNow().notNull(),
// //   user_id:uuid("user_id")
// //     .notNull()
// //     .references(() => users.id, { onDelete: "cascade" }),
// //   feed_id:integer("feed_id")
// //     .notNull()
// //     .references(() => feed.id, { onDelete: "cascade" }),
// // },
// // (table)=>({
// //   userFeedUnique : unique("user_feed_unique").on(table.user_id,table.feed_id)
// // }))
// import { pgTable, timestamp, uuid, text, unique, serial } from "drizzle-orm/pg-core";

// // ----------------- USERS -----------------
// export const users = pgTable("users", {
//   id: uuid("id").primaryKey().defaultRandom().notNull(),
//   createdAt: timestamp("created_at").notNull().defaultNow(),
//   updatedAt: timestamp("updated_at")
//     .notNull()
//     .defaultNow()
//     .$onUpdate(() => new Date()),
//   name: text("name").notNull().unique(),
// });

// // ----------------- FEEDS -----------------
// export const feed = pgTable("feed", {
//   id: uuid("id").primaryKey().defaultRandom().notNull(), // string UUID
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at").defaultNow().notNull(),
//   name: text("name").notNull(),
//   url: text("url").notNull().unique(),
//   user_id: uuid("user_id")
//     .notNull()
//     .references(() => users.id, { onDelete: "cascade" }),
// });


// // ----------------- FEED_FOLLOWS -----------------
// export const feed_follows = pgTable(
//   "feed_follows",
//   {
//     id: uuid("id").primaryKey().defaultRandom().notNull(), // ✅ CHANGED from serial to UUID
//     createdAt: timestamp("created_at").defaultNow().notNull(),
//     updatedAt: timestamp("updated_at").defaultNow().notNull(),
//     user_id: uuid("user_id") // ✅ CHANGED from integer to UUID
//       .notNull()
//       .references(() => users.id, { onDelete: "cascade" }),
//     feed_id: uuid("feed_id") // ✅ CHANGED from integer to UUID
//       .notNull()
//       .references(() => feed.id, { onDelete: "cascade" }),
//   },
//   (table) => ({
//     userFeedUnique: unique("user_feed_unique").on(
//       table.user_id,
//       table.feed_id
//     ), // ✅ added unique constraint
//   })
// );
import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feed = pgTable("feed", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),  // UUID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  lastfetchedAt: timestamp("last_fetched_at")
});

export const feed_follows = pgTable(
  "feed_follows",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(), // UUID
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    user_id: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    feed_id: uuid("feed_id").notNull().references(() => feed.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userFeedUnique: unique("user_feed_unique").on(table.user_id, table.feed_id), // unique constraint
  })
);

export const posts = pgTable("posts",{
  id:uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(()=>new Date()),
  title: text("title").notNull(),
  url:text("url").notNull().unique(),
  description : text("description"),
  publishedAt : timestamp("published_at"),
  feed_id : uuid("feed_id").notNull().references(()=>feed.id,{onDelete:"cascade"})
})