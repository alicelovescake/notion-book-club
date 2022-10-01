export type RatingMapType = {
  [book: string]: { [user: string]: number };
};

type Book = { rating: number; favorites: number };

export type NewBookEntriesType = {
  [book: string]: Book;
};

export type ExistingBookEntriesType = {
  [books: string]: Book & { pageId: string };
};

export type DatabaseNumberPropertyType = {
  id: string;
  type: string;
  number: number | null;
};

type DatabaseTitleType = {
  type: string;
  text: Record<string, unknown>;
  annotations: Record<string, unknown>;
  plain_text: string;
  href: string | null;
};

export type DatabaseTitlePropertyType = {
  id: string;
  type: string;
  title: DatabaseTitleType[];
};

export type NewBookEntry = {
  book: string;
  rating: number;
  favorites: number;
};

export type UpdatedBookEntry = NewBookEntry & { pageId: string };
