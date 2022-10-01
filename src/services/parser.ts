import fs from "fs";
import { NewBookEntriesType, RatingMapType } from "../utils";

// parse data from new line separated entries to an array of data with names lower cased and whitespace removed
function validateData(data: string) {
  return data
    .split("\n")
    .map((entry: string) =>
      entry.split(",").map((name: string) => name.trim().toLowerCase())
    );
}

// read ratings.csv file from src/data folder
function readData() {
  try {
    const ratings = fs.readFileSync("./src/data/test.csv", "utf8");
    return validateData(ratings);
  } catch (err) {
    console.log("Sorry, your book ratings file was not found!");
  }

  return [];
}

// creates a hashmap: {book: {user: rating }}. Newer entries with same book and author will override previous rating
function getRatingsMap(data: string[][]) {
  const ratingsMap: RatingMapType = {};

  data.forEach(([book, user, rating]) => {
    if (+rating < 0 || +rating > 5) {
      throw new Error("Ratings must be between 0 and 5 stars!");
    }
    ratingsMap[book] = ratingsMap[book] || {};
    ratingsMap[book][user] = +rating;
  });

  return ratingsMap;
}

// creates a hashmap: {book: [avgRating, favoriteCount]}.
function getNewBookEntries(ratings: string[][]) {
  const newBookEntries: NewBookEntriesType = {};
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
