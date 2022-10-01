"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@notionhq/client");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const notion = new client_1.Client({ auth: process.env.NOTION_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;
function addItem(text) {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      console.log("yoo", databaseId);
      const response = yield notion.pages.create({
        parent: {
          database_id:
            databaseId !== null && databaseId !== void 0 ? databaseId : "",
        },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: text,
                },
              },
            ],
          },
        },
      });
      console.log(response);
      console.log("Success! Entry Added");
    } catch (error) {
      // console.error(error.body);
    }
  });
}
// addItem("test entry");
fs_1.default.readFile("./ratings.csv", "utf8", function (err, data) {
  console.log("heyy");
  console.log(data);
});
