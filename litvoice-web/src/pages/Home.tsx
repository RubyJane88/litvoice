import { useRef, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { BookCard } from "@/components/BookCard";
import { searchBooks } from "@/lib/books";
import type { Book } from "@/lib/books";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BookCardSkeleton } from "@/components/BookCardSkeleton";

export function Home() {
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const latestRequestRef = useRef(0);

  async function handleSearch(query: string) {
    const requestId = ++latestRequestRef.current;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await searchBooks(query);
      if (requestId !== latestRequestRef.current) return;
      setResults(data.docs);
    } catch (err) {
      if (requestId !== latestRequestRef.current) return;
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setResults([]);
    } finally {
      if (requestId === latestRequestRef.current) {
        setLoading(false);
      }
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <SearchBar onSearch={handleSearch} loading={loading} />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {loading && (
        <ul className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i}>
              <BookCardSkeleton />
            </li>
          ))}
        </ul>
      )}
      {!loading && searched && results.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">No results found.</p>
      )}
      {!loading && results.length > 0 && (
        <ErrorBoundary>
          <ul className="flex flex-col gap-3">
            {results.map((book) => (
              <li key={book.key}>
                <BookCard book={book} />
              </li>
            ))}
          </ul>
        </ErrorBoundary>
      )}
    </main>
  );
}

export default Home;
