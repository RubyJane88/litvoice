const BASE_URL = "https://openlibrary.org";

export async function searchBooks(query: string, limit = 10) {
  const url = `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=key,title,author_name,cover_i,first_publish_year`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open Library error: ${res.status}`);
  return res.json();
}

export async function getBook(olid: string) {
  const url = `${BASE_URL}/works/${olid}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open Library error: ${res.status}`);
  return res.json();
}