const BASE_URL = "https://openlibrary.org";
const OPENLIBRARY_TIMEOUT_MS = (() => {
  const raw = Number(process.env.OPENLIBRARY_TIMEOUT_MS ?? 4_000);
  return Number.isFinite(raw) ? raw : 4_000;
})();

export class OpenLibraryError extends Error {
  constructor(
    public readonly status: number,
    public readonly url: string,
  ) {
    super(`Open Library error: ${status}`);
    this.name = "OpenLibraryError";
  }
}

async function fetchOpenLibraryJson(path: string) {
  const url = `${BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(OPENLIBRARY_TIMEOUT_MS),
    });

    if (!res.ok) throw new OpenLibraryError(res.status, url);
    return res.json();
  } catch (err) {
    if (err instanceof OpenLibraryError) throw err;
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new OpenLibraryError(504, url);
    }
    throw new OpenLibraryError(503, url);
  }
}

export async function searchBooks(query: string, limit = 10) {
  const path =
    `/search.json?q=${encodeURIComponent(query)}` +
    `&limit=${limit}` +
    `&fields=key,title,author_name,cover_i,first_publish_year`;
  return fetchOpenLibraryJson(path);
}

export async function getBook(olid: string) {
  return fetchOpenLibraryJson(`/works/${olid}.json`);
}
