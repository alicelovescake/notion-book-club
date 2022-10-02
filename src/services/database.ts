import { isFullPage } from "@notionhq/client";
import {
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {
  DatabaseTitleProperty,
  DatabaseNumberProperty,
  getErrorMessage,
  NewBookEntries,
  ExistingBookEntries,
  UpdatedBookEntry,
  NewBookEntry,
} from "../utils";
import { notion } from "../lib/notion";

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error("DATABASE_ID required");
}
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

/**
 * parse ratings from notion into a hashmap of existing book entries
 * @param data page response from API call database.query
 * @returns a hashmap of {book: {rating, favorites, pageId}}
 */
function getExistingBookEntries(
  data: (PageObjectResponse | PartialPageObjectResponse)[]
) {
  const existingBookEntries: ExistingBookEntries = {};

  for (const page of data) {
    if (!isFullPage(page)) {
      continue;
    }

    const favorites =
      (page.properties.Favorites as DatabaseNumberProperty).number ?? 0;
    const rating =
      (page.properties.Rating as DatabaseNumberProperty).number ?? 0;
    const book = (page.properties["Book Title"] as DatabaseTitleProperty)
      .title[0]?.plain_text;

    if (!book) {
      continue;
    }

    existingBookEntries[book] = { rating, favorites, pageId: page.id };
  }

  return existingBookEntries;
}

/**
 * helper function to get property parameter in update/create API calls
 * @param {Object}  - book is title of new book
 *                  - rating is average rating
 *                  - favorites is number of 5 star ratings
 * @returns property object in correct API format
 */
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

/**
 * API call to create a new page/ row in the book club database
 * @param {Object}  - book is title of new book
 *                  - rating is average rating
 *                  - favorites is number of 5 star ratings
 */
async function addBook({ book, rating, favorites }: NewBookEntry) {
  try {
    const response = await notion.pages.create({
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

/**
 * API call to update an existing page/row in the book club database
 * @param {Object}  - book is title of new book
 *                  - rating is average rating
 *                  - favorites is number of 5 star ratings
 *                  - pageId is id of page to be updated
 */
async function updateBook({
  book,
  rating,
  favorites,
  pageId,
}: UpdatedBookEntry) {
  try {
    await notion.pages.update({
      page_id: pageId,
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

/**
 * Updates database by checking which book entries already exist to update, and which entries need to be added
 * @param newRatings new ratings from csv file in hashmap
 * @param existingRatings existing ratings from notion in hashmap
 */
export async function updateDatabase(
  newRatings: NewBookEntries,
  existingRatings: ExistingBookEntries
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
