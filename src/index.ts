import "dotenv/config";
import { getNewRatings, getExistingRatings, updateDatabase } from "./services";
import { getErrorMessage } from "./utils";

async function main() {
  try {
    const newRatings = getNewRatings();
    const existingRatings = await getExistingRatings();
    updateDatabase(newRatings, existingRatings);
  } catch (error) {
    getErrorMessage(error), process.exit(1);
  }
}

main();
