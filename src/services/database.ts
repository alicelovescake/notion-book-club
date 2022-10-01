import { isFullPage } from "@notionhq/client";
import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {
  DatabaseTitlePropertyType,
  DatabaseNumberPropertyType,
  getErrorMessage,
  NewBookEntriesType,
  ExistingBookEntriesType,
  UpdatedBookEntry,
  NewBookEntry,
} from "../utils";
import { notion } from "../lib/notion";

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error("DATABASE_ID required");
}
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

// parse ratings from notion into a map of {book: {rating, favorites, pageId}}
function getExistingBookEntries(
  data: (PageObjectResponse | PartialPageObjectResponse)[]
) {
  const existingBookEntries: ExistingBookEntriesType = {};

  for (const page of data) {
    if (!isFullPage(page)) {
      continue;
    }

    const favorites =
      (page.properties.Favorites as DatabaseNumberPropertyType).number ?? 0;
    const rating =
      (page.properties.Rating as DatabaseNumberPropertyType).number ?? 0;
    const book = (page.properties["Book Title"] as DatabaseTitlePropertyType)
      .title[0]?.plain_text;

    if (!book) {
      continue;
    }

    existingBookEntries[book] = { rating, favorites, pageId: page.id };
  }

  return existingBookEntries;
}

// helper function to get propertie parameter in update/create API calls
function getProperties({ book, rating, favorites }: NewBookEntry) {
  return {
    "Book Title": {
      title: [
        {
          text: {
            content: book,
          },
        },
      ],
    },
    Rating: {
      number: rating,
    },
    Favorites: {
      number: favorites,
    },
  };
}

// add new entry to workspace
async function addBook({ book, rating, favorites }: NewBookEntry) {
  try {
    await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: getProperties({
        book,
        rating,
        favorites,
      }),
    });
  } catch (error) {
    getErrorMessage(error);
  }
}

// update entry in workspace
async function updateBook({
  book,
  rating,
  favorites,
  pageId,
}: UpdatedBookEntry) {
  await notion.pages.update({
    page_id: pageId,
    properties: getProperties({
      book,
      rating,
      favorites,
    }),
  });
}

// updates database by checking which entries already exist and need to be updated, and which entries need to be added
export async function updateDatabase(
  newRatings: NewBookEntriesType,
  existingRatings: ExistingBookEntriesType
) {
  const booksToUpdate: UpdatedBookEntry[] = [];
  const booksToAdd: NewBookEntry[] = [];

  for (const book of Object.keys(newRatings)) {
    if (existingRatings[book]) {
      booksToUpdate.push({
        ...existingRatings[book],
        ...newRatings[book],
        book,
      });
    } else {
      booksToAdd.push({ ...newRatings[book], book });
    }
  }

  await Promise.all([
    ...booksToUpdate.map((entry) => updateBook(entry)),
    ...booksToAdd.map((entry) => addBook(entry)),
  ]);
}

// fetch all pages from notion database
export async function getExistingRatings() {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
    });

    return getExistingBookEntries(response.results);
  } catch (error) {
    getErrorMessage(error);
  }

  return {};
}
