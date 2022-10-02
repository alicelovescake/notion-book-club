## Welcome!

Can you believe our book club is celebrating our 10th anniversary?! 🎉

Welcome to our Notion bot that populates our favorite tool with a list of books ranked by average rating and favorite count!

## How Does It Work?

### Demo

![demo3](https://user-images.githubusercontent.com/66543449/193440996-c098c531-faa4-4065-a4c8-289d99368ee7.gif)

### Folder Structure

```
notion-book-club/
├─ node_modules/
├─ src/
│  ├─ data/
│  │  ├─ ratings.csv
|  ├─ lib/
|  │  │  ├─ notion.ts
│  ├─ utils/
│  │  ├─ errors.ts
│  │  ├─ index.ts
│  │  ├─ types.ts
│  ├─ services/
│  │  ├─ database.ts
│  │  ├─ index.ts
│  │  ├─ parser.ts
│  ├─ index.ts
├─ .gitignore
├─ package.json
├─ README.md
├─ tsconfig.json
```

## Git It Running

1. Create a [Notion integration](https://developers.notion.com/docs/getting-started#step-1-create-an-integration) to get the NOTION_KEY.
2. Share a [database with your integration](https://developers.notion.com/docs/getting-started#step-2-share-a-database-with-your-integration) to get the NOTION_DATABASE_ID
3. Download the zip file or `git clone` to your favorite working directory
4. `yarn` to create a large folder of node_modules
5. Copy `.env.example` to `.env` to store your NOTION_KEY and NOTION_DATABASE_ID
6. update `ratings.csv` in `src/data` folder if you want to change data
7. `yarn start` to update your database!

## Challenges/ Resources I used

I wanted to challenge myself by creating a Typescript project from scratch. It took longer to define types but in the end it was helpful to understand exactly the data I was transforming. Below are resources and challenges I ran into:

1. [Notion Developer Guide](https://developers.notion.com/docs/getting-started#step-2-share-a-database-with-your-integration) : Helpful resource for API reference
2. [Notion Javascript SDK](https://github.com/makenotion/notion-sdk-js) : Helpful wrappers to call APIs. Loved the examples/ helpers related to Typescript.
   - Challenge: Ran into an issue trying to create proper Typescript types for the custom property in the response from `notion.databases.query`
   - Resolution: Searched the issues tab on notion-sdk's Github project and figured it out
3. [dotenv](https://www.npmjs.com/package/dotenv) : load env variables
   - Challenge: Got stuck because my env variables were not loading in my services functions even though I called `dotenv.config()` in my `index.js` file.
   - Resolution: Read readme of [dotenv Github project](https://github.com/motdotla/dotenv) to learn that modules are imported first and executed in depth-first traversal of the dependency graph, meaning I had to move my `dotenv` import to the first row!
4. [fs](https://nodejs.org/api/fs.html#fs_fs_readfile_filename_encoding_callback): Already built into NodeJS. I used `fs.readFileSync` to read the csv file.
   - Challenge: Never used `fs` directly and wondered what the differences between `fs.readFileSync` and `fs.readFile` were.
   - Resolution: Found this helpful [StackOverFlow](<https://stackoverflow.com/questions/17604866/difference-between-readfile-and-readfilesync#:~:text=readFileSync()%20is%20synchronous%20and,gets%20called%20when%20they%20finish.>) answer. Good reminder that `readFileSync` can tie up the single thread loop if it takes a long time!
5. [Typescript Docs](https://www.typescriptlang.org/docs/handbook/2/objects.html) for creating advanced types
   - Challenge: Wanted to have proper error handling. Since error is an unknown type in Typescript, I cannot call any methods directly such as `error.message`
   - Resolution: Found a [Ken Dodds article](https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript) on how he catches error messages in Typescript. Thankfully, I also discovered that Notion Javascript SDK has helpers such as `isNotionClientError`, `ClientErrorCode`, `APIErrorCode` to help me with error handling

## Further Improvements

### Testing

I manually tested my functions to ensure that my code is working correctly.

With more time, I would write proper Jest tests, including:

- Unit Tests: Test success and error handling cases for each function within the service. Mocking data from API calls.
- Integration Tests: Testing that the integration between the `parser` service and the `database` service are functioning reliably and any future changes will not break existing functionality

### API documentation

Overall, the Notion developer API Reference, Guide, and Javascript SDK README was helpful and clear. The only part I was slightly confused on was whether adding/updating rows in my database table was a page/block/or database. Having more clear examples of each type of component would be helpful.

P.S A small bug I found in the documentation

- In API Reference -> Update a block -> SDK example -> `block_id` is missing from the request

## The Developer

<p align="center">
<img src="https://user-images.githubusercontent.com/66543449/193435467-81c261f5-07a3-4e09-8942-e7391a998ec7.png" width="200" />
</p>

Hi! My name is Alice.

I'm a 4th year computer science student at University of British Columbia (UBC). From eating rotten shark in Iceland to floating in the Dead Sea to trekking on Everest, I love to challenge myself! Curious to see more of what I've done? [Visit me at my digital garden.](https://alicezhao.com) 🌱
