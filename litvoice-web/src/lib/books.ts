import type { operations } from "./schema";
import { apiFetch } from "./api";

export type BookDetail =
  operations["getBookById"]["responses"][200]["content"]["application/json"];

export type SearchResult =
  operations["searchBooks"]["responses"][200]["content"]["application/json"];

export type Book =
  operations["getBookById"]["responses"][200]["content"]["application/json"];

export function coverUrl(coverId: number): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
}

export async function searchBooks(
  query: string,
  limit = 10,
): Promise<SearchResult> {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  return apiFetch<SearchResult>(`/books/search?${params}`);
}

export async function getBook(olid: string): Promise<BookDetail> {
  return apiFetch<BookDetail>(`/books/${olid}`);
}
