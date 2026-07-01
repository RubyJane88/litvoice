import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router";
import { getBook, coverUrl } from "@/lib/books";
import type { BookDetail as BookDetailType } from "@/lib/books";
import { BookCardSkeleton } from "@/components/BookCardSkeleton";
import { Bookmark, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getSavedBook,
  saveBook,
  removeBook,
  updateSavedBookPosition,
} from "@/lib/db";
import type { SavedBook } from "@/lib/db";
import { AudioPlayer } from "@/components/AudioPlayer";

export function BookDetail() {
  const { olid } = useParams<{ olid: string }>();
  const [book, setBook] = useState<BookDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [playerActive, setPlayerActive] = useState(false);
  const [startPosition, setStartPosition] = useState(0);

  useEffect(() => {
    if (!book?.key) return;
    getSavedBook(book.key).then((savedBook) => {
      setSaved(savedBook !== undefined);
      setStartPosition(savedBook?.currentPosition ?? 0);
    });
  }, [book?.key]);

  const handleSaveClick = useCallback(async () => {
    if (!book) return;
    const nextSaved = !saved;
    setSaved(nextSaved);
    try {
      if (!nextSaved) {
        await removeBook(book.key);
      } else {
        const bookToSave: SavedBook = {
          key: book.key,
          title: book.title,
          author_name: book.author_name ?? [],
          cover_i: book.cover_i ?? null,
          first_publish_year: book.first_publish_year,
          savedAt: Date.now(),
        };
        await saveBook(bookToSave);
      }
    } catch (err) {
      console.error("Failed to update reading list:", err);
      setSaved(saved);
    }
  }, [book, saved]);

  const handlePositionChange = useCallback(
    (position: number) => {
      if (saved && book) {
        void updateSavedBookPosition(book.key, position);
      }
    },
    [saved, book],
  );

  useEffect(() => {
    if (!olid) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    getBook(olid)
      .then((data) => {
        if (!cancelled) {
          setBook(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const rawMessage =
            err instanceof Error ? err.message : "Something went wrong.";
          try {
            const parsed = JSON.parse(rawMessage) as { message?: unknown };
            setError(
              typeof parsed.message === "string"
                ? parsed.message
                : rawMessage,
            );
          } catch {
            setError(rawMessage);
          }
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [olid]);

  if (loading)
    return (
      <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        <BookCardSkeleton />
      </main>
    );

  if (error)
    return (
      <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-4">
        <p className="text-sm text-destructive">{error}</p>
        <Link to="/" className="text-sm text-primary hover:underline">
          ← Back to search
        </Link>
      </main>
    );

  if (!book) return null;

  return (
    <main
      className={`max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6${playerActive ? " pb-24" : ""}`}>
      <Link to="/" className="text-sm text-primary hover:underline">
        ← Back to search
      </Link>

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

        <div className="flex flex-col gap-2 flex-1">
          <h1 className="text-2xl font-heading font-bold leading-tight">
            {book.title}
          </h1>
          {book.author_name && (
            <p className="text-muted-foreground">
              {book.author_name.join(", ")}
            </p>
          )}
          {book.first_publish_year && (
            <p className="text-sm text-muted-foreground">
              First published {book.first_publish_year}
            </p>
          )}
          {book.edition_count && (
            <p className="text-sm text-muted-foreground">
              {book.edition_count} editions
            </p>
          )}
          {book.language && (
            <p className="text-sm text-muted-foreground">
              Languages: {book.language.slice(0, 5).join(", ")}
            </p>
          )}

          <div className="pt-4 flex gap-2 flex-wrap">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSaveClick}
              aria-label={saved ? "Remove from reading list" : "Save for later"}
              className="gap-2 text-sm">
              <Bookmark
                className="w-4 h-4"
                fill={saved ? "currentColor" : "none"}
              />
              {saved ? "Saved" : "Save"}
            </Button>

            <Button
              type="button"
              variant="default"
              disabled={!book.description || playerActive}
              title={
                !book.description
                  ? "No synopsis available to play"
                  : undefined
              }
              onClick={() => setPlayerActive(true)}
              className="gap-2 text-sm">
              <Play className="w-4 h-4" />
              {playerActive
                ? "Playing…"
                : startPosition > 0
                  ? "Resume"
                  : "Play"}
            </Button>
          </div>
        </div>
      </div>

      {book.description && (
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">
            About
          </p>
          <p className="text-sm leading-relaxed">{book.description}</p>
        </div>
      )}

      {playerActive && book.description && (
        <AudioPlayer
          text={book.description}
          title={book.title}
          startPosition={startPosition}
          onPositionChange={handlePositionChange}
          onClose={() => setPlayerActive(false)}
        />
      )}
    </main>
  );
}

export default BookDetail;
