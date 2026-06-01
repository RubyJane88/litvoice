import {searchBooks, getBook} from '../../lib/openlibrary.js';
import {BookSchema, SearchResultSchema} from './books.schema.js';


export async function searchBooksService(query: string, limit = 10) {
  const raw = await searchBooks(query, limit);
  return SearchResultSchema.parse(raw);

}

export async function getBookService(olid: string) {
  const raw = await getBook(olid);
  return BookSchema.parse(raw);
}