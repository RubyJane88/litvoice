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
        const sorted = [...saved].sort((a, b) => b.savedAt - a.savedAt);
        setBooks(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggleSave = (key: string, saved: boolean) => {
    if (!saved) setBooks((prev) => prev.filter((b) => b.key !== key));
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold mb-1">Reading List</h1>
        <p className="text-sm text-muted-foreground">
          Books you've saved to listen to later.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading your list…</p>
      )}

      {!loading && books.length === 0 && (
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4 text-primary">
            <Bookmark className="w-6 h-6" />
          </div>
          <p className="font-semibold text-sm mb-1">No saved books yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Search for a book and save it to your reading list.
          </p>
          <Link to="/" className="text-sm text-primary hover:underline font-medium">
            Browse books
          </Link>
        </div>
      )}

      {!loading && books.length > 0 && (
        <ErrorBoundary>
          <ul className="flex flex-col gap-3">
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
