## Welcome!

Can you believe our book club is celebrating our 10th anniversary?! 🎉

Welcome to our Notion bot that populates our favorite tool with a list of books ranked by average rating and favorite count!

## How Does It Work?

### Folder Structure

```
notion-bookclub/
├─ node_modules/
├─ src/
│  ├─ data/
│  │  ├─ ratings.csv
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

1. Download the zip file or `git clone` to your favorite working directory
2. `yarn` to create a large folder of node_modules
3. Copy `.env.example` to `.env` to put your API key and database id
4. update `ratings.csv` in `src/data` folder if you want to change data
5. `yarn start` to update your database!

## The Developer

<p align="center">
<img src="https://user-images.githubusercontent.com/66543449/193435467-81c261f5-07a3-4e09-8942-e7391a998ec7.png" width="200" />
</p>

Hi! My name is Alice Zhao.

I'm a 4th year computer science student at University of British Columbia (UBC). From eating rotten shark in Iceland to floating in the Dead Sea to trekking on Everest, I love to challenge myself! Curious to see more of what I've done? [Visit me at my digital garden.](https://alicezhao.com) 🌱
