import { getBook, searchBooks } from "../../lib/openlibrary.js";
import { BookSchema, SearchResultSchema } from "./books.schema.js";

export async function searchBooksService(query: string, limit = 10) {
  const raw = await searchBooks(query, limit);
  return SearchResultSchema.parse(raw);
}

export async function getBookService(olid: string) {
  const raw = (await getBook(olid)) as {
    covers?: unknown[];
    cover_i?: number;
    description?: string | { value: string };
    [key: string]: unknown;
  };

  const firstCover =
    Array.isArray(raw.covers) && typeof raw.covers[0] === "number"
      ? raw.covers[0]
      : undefined;

  const rawDescription = raw.description;

  const description =
    typeof raw.description === "string"
      ? raw.description
      : typeof raw.description?.value === "string"
        ? raw.description.value
        : undefined;

  const normalized = {
    ...raw,
    cover_i: firstCover ?? raw.cover_i,
    description,
  };
  return BookSchema.parse(normalized);
}
