# Blog Aggregator CLI

A simple CLI tool to follow RSS/Atom feeds, fetch posts, and browse them in the terminal. Built with TypeScript and Drizzle ORM.

---

## Prerequisites

- Node.js >= 20
- PostgreSQL database
- npm or pnpm

---

## Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd blog_aggregator
npm install
npx drizzle-kit generate
npx drizzle-kit migrate
//setup config.json
{
  "currentUserName": "your-username"
}
```
2. Commands which you can use
```bash
npm run start register "your_name"
npm run start login "your_name"
npm run start addfeed "TechCrunch" "https://techcrunch.com/feed/"
npm run start following
npm run start agg 1m
npm run start browse 5
```
have fun. :)
3. Other commands which require more than one user.
```
npm run start follow "https://techcrunch.com/feed/"
npm run start following //to get the following of current user logged in.
