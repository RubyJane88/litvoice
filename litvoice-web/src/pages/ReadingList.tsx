import { useEffect, useState } from "react";
import { getSavedBooks } from "@/lib/db";
import type { SavedBook } from "@/lib/db";
import { BookCard } from "@/components/BookCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Bookmark } from "lucide-react";
import { Link } from "react-router";

export function ReadingList() {
  const [books, setBooks] = useState<SavedBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedBooks()
      .then((saved) => {
        // Sort by savedAt descending
        const sorted = [...saved].sort((a, b) => b.savedAt - a.savedAt);
        setBooks(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggleSave = (key: string, saved: boolean) => {
    if (!saved) {
      setBooks((prev) => prev.filter((b) => b.key !== key));
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Bookmark className="w-6 h-6 text-primary" fill="currentColor" />
        <h1 className="text-2xl font-bold">My Reading List</h1>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading your list...</p>
      )}

      {!loading && books.length === 0 && (
        <div className="text-center py-12 border border-dashed rounded-lg border-border bg-card/20 flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-sm">Your reading list is empty.</p>
          <Link
            to="/"
            className="text-sm text-primary hover:underline font-semibold"
          >
            Find books to save
          </Link>
        </div>
      )}

      {!loading && books.length > 0 && (
        <ErrorBoundary>
          <ul className="flex flex-col gap-3 animate-fade-in">
            {books.map((book) => (
              <li key={book.key}>
                <BookCard
                  book={{ ...book, cover_i: book.cover_i ?? undefined }}
                  onToggleSave={handleToggleSave}
                />
              </li>
            ))}
          </ul>
        </ErrorBoundary>
      )}
    </main>
  );
}

export default ReadingList;
