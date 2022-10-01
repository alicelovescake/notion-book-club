import { Client } from "@notionhq/client";

const NOTION_KEY = process.env.NOTION_KEY;

if (!NOTION_KEY) {
  throw new Error("NOTION_KEY required");
}

export const notion = new Client({ auth: NOTION_KEY });
