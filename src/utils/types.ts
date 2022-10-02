export type RatingMap = {
  [book: string]: { [user: string]: number };
};

type Book = { rating: number; favorites: number };

export type NewBookEntries = {
  [book: string]: Book;
};

export type ExistingBookEntries = {
  [books: string]: Book & { pageId: string };
};

export type DatabaseNumberProperty = {
  id: string;
  type: string;
  number: number | null;
};

type DatabaseTitle = {
  type: string;
  text: Record<string, unknown>;
  annotations: Record<string, unknown>;
  plain_text: string;
  href: string | null;
};

export type DatabaseTitleProperty = {
  id: string;
  type: string;
  title: DatabaseTitle[];
};

export type NewBookEntry = {
  book: string;
  rating: number;
  favorites: number;
};

export type UpdatedBookEntry = NewBookEntry & { pageId: string };
