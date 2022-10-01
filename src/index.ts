import "dotenv/config";
import { getNewRatings, getExistingRatings, updateDatabase } from "./services";
import { getErrorMessage } from "./utils";

async function main() {
  const newRatings = getNewRatings();
  const existingRatings = await getExistingRatings();
  updateDatabase(newRatings, existingRatings);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    getErrorMessage(error), process.exit(1);
  });
