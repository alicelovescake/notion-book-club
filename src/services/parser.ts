import fs from "fs";
import { NewBookEntries, RatingMap } from "../utils";

/**
 * Validate and transform data
 * @param data string from csv file
 * @returns An 2d array with each entry as an array of data that include rating and name of book & user in lower case and whitespace removed
 */
function validateData(data: string) {
  return data
    .split("\n")
    .map((entry: string) =>
      entry.split(",").map((name: string) => name.trim().toLowerCase())
    );
}

/**
 * read ratings.csv file from src/data folder
 * @returns result from validate data: 2D array of entries of new books we extracted from csv file
 */
function readData() {
  try {
    const ratings = fs.readFileSync("./src/data/ratings.csv", "utf8");
    return validateData(ratings);
  } catch (err) {
    console.log("Sorry, your book ratings file was not found!");
  }

  return [];
}

/**
 * Creates a hashmap to store all user ratings for a book. Newer entries with same book and author will override previous rating
 * @param ratings 2D array of entries of new books extracted from csv
 * @returns a hashmap: {book: {user: rating }}
 */
function getRatingsMap(ratings: string[][]) {
  const ratingsMap: RatingMap = {};

  ratings.forEach(([book, user, rating]) => {
    if (+rating < 0 || +rating > 5) {
      throw new Error("Ratings must be between 0 and 5 stars!");
    }
    ratingsMap[book] = ratingsMap[book] || {};
    ratingsMap[book][user] = +rating;
  });

  return ratingsMap;
}

/**
 * // creates a hashmap to store new book entries.
 * @param ratings 2D array of entries of new books extracted from csv
 * @returns a hashmap: {book: {rating, favorites}}
 */
function getNewBookEntries(ratings: string[][]) {
  const newBookEntries: NewBookEntries = {};
  const ratingsMap = getRatingsMap(ratings);

  // Time complexity is O(#books * #users). This is necessary because we want to eliminate
  // duplicate ratings by the same user by generating the ratings map
  Object.keys(ratingsMap).forEach((book: string) => {
    let ratingsCount = 0;
    let ratingsSum = 0;
    let favorites = 0;

    Object.keys(ratingsMap[book]).forEach((user: string) => {
      const rating = ratingsMap[book][user];
      ratingsCount++;
      ratingsSum += rating;
      if (rating === 5) {
        favorites++;
      }
    });

    const rating = Math.round((ratingsSum / ratingsCount) * 10) / 10;

    newBookEntries[book] = { rating, favorites };
  });

  return newBookEntries;
}

export function getNewRatings() {
  const ratings = readData();
  return getNewBookEntries(ratings);
}
