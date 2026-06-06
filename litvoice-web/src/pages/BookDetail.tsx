import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getBook, coverUrl } from "@/lib/books";
import type { BookDetail as BookDetailType } from "@/lib/books";
import { BookCardSkeleton } from "@/components/BookCardSkeleton";

export function BookDetail() {
  const { olid } = useParams<{ olid: string }>();
  const [book, setBook] = useState<BookDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!olid) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    getBook(olid)
      .then((data) => {
        if (!cancelled) { setBook(data); setLoading(false); }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
           const rawMessage = err instanceof Error ? err.message : "Something went wrong.";
           try {
             const parsed = JSON.parse(rawMessage) as { message?: unknown };
             setError(typeof parsed.message === "string" ? parsed.message : rawMessage);
           } catch {
             setError(rawMessage);
           }
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [olid]);

  if (loading) return (
    <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <BookCardSkeleton />
    </main>
  );

  if (error) return (
    <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-4">
      <p className="text-sm text-destructive">{error}</p>
      <Link to="/" className="text-sm text-primary hover:underline">← Back to search</Link>
    </main>
  );

  if (!book) return null;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <Link to="/" className="text-sm text-primary hover:underline">← Back to search</Link>
      <div className="flex gap-6">
        {book.cover_i ? (
          <img
            src={coverUrl(book.cover_i)}
            alt={book.title}
            loading="lazy"
            className="w-32 rounded shrink-0"
          />
        ) : (
          <div className="w-32 h-48 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground shrink-0">
            No cover
          </div>
        )}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold leading-tight">{book.title}</h1>
          {book.author_name && (
            <p className="text-muted-foreground">{book.author_name.join(", ")}</p>
          )}
          {book.first_publish_year && (
            <p className="text-sm text-muted-foreground">First published {book.first_publish_year}</p>
          )}
          {book.edition_count && (
            <p className="text-sm text-muted-foreground">{book.edition_count} editions</p>
          )}
          {book.language && (
            <p className="text-sm text-muted-foreground">
              Languages: {book.language.slice(0, 5).join(", ")}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default BookDetail;
