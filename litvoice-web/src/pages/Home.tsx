import { useRef, useState } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { BookCard } from "@/components/BookCard";
import { searchBooks } from "@/lib/books";
import type { Book } from "@/lib/books";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BookCardSkeleton } from "@/components/BookCardSkeleton";

type SearchCache = {
  results: Book[];
  searched: boolean;
  error: string | null;
};

function readCache(): SearchCache {
  try {
    const raw = sessionStorage.getItem("lv-search");
    return raw
      ? JSON.parse(raw)
      : { results: [], searched: false, error: null };
  } catch {
    return { results: [], searched: false, error: null };
  }
}

function writeCache(state: SearchCache) {
  try {
    sessionStorage.setItem("lv-search", JSON.stringify(state));
  } catch {}
}

export function Home() {
  const cached = readCache();
  const [results, setResults] = useState<Book[]>(cached.results);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(cached.error);
  const [searched, setSearched] = useState(cached.searched);
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
      writeCache({ results: data.docs, searched: true, error: null });
    } catch (err) {
      if (requestId !== latestRequestRef.current) return;
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      setResults([]);
      writeCache({ results: [], searched: true, error: msg });
    } finally {
      if (requestId === latestRequestRef.current) setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <section className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-bold tracking-wider uppercase mb-5">
          <Sparkles className="w-2.5 h-2.5" />
          Free · Works offline
        </div>
        <h1 className="text-4xl font-heading font-bold tracking-tight mb-4">
          Read books with your <em className="text-accent">ears</em>
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-lg mx-auto mb-4">
          Listen to thousands of classic books for free — at the gym, on your
          walk, doing the dishes. Upload your own PDF, EPUB, or DOCX too.
        </p>
        <p className="inline-flex items-center gap-1.5 text-sm text-primary font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          Your files never leave your device
        </p>
      </section>

      <SearchBar onSearch={handleSearch} loading={loading} />
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      {loading && (
        <ul className="flex flex-col gap-3 mt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i}>
              <BookCardSkeleton />
            </li>
          ))}
        </ul>
      )}
      {!loading && searched && results.length === 0 && !error && (
        <p className="text-sm text-muted-foreground mt-4">No results found.</p>
      )}
      {!loading && results.length > 0 && (
        <ErrorBoundary>
          <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3 mt-6">
            Results
          </p>
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
