import { useState } from "react";
import { SearchBar } from "@/components/SearchBar.js";
import { BookCard } from "@/components/BookCard.js";
import { searchBooks } from "@/lib/books.js";
import type { Book } from "@/lib/books.js";

export function Home() {
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch(query: string) {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await searchBooks(query);
      setResults(data.docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">LitVoice</h1>
      <SearchBar onSearch={handleSearch} loading={loading} />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {loading && (
        <p className="text-sm text-muted-foreground">Searching…</p>
      )}
      {!loading && searched && results.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">No results found.</p>
      )}
      {!loading && results.length > 0 && (
        <ul className="flex flex-col gap-3">
          {results.map((book) => (
            <li key={book.key}>
              <BookCard book={book} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
