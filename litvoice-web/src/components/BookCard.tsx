import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Book as BookIcon, Play } from "lucide-react";
import { coverUrl } from "@/lib/books";
import type { Book } from "@/lib/books";
import { Link } from "react-router";
import { isBookSaved, saveBook, removeBook } from "@/lib/db";
import type { SavedBook } from "@/lib/db";

type Props = {
  book: Book;
  onToggleSave?: (key: string, saved: boolean) => void;
  onPlay?: (key: string) => void;
};

export function BookCard({ book, onToggleSave, onPlay }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    isBookSaved(book.key).then(setSaved);
  }, [book.key]);

  const handleSaveClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
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
        onToggleSave?.(book.key, nextSaved);
      } catch (err) {
        console.error("Failed to update reading list:", err);
        setSaved(saved);
      }
    },
    [book, saved, onToggleSave],
  );

  return (
    <Link to={`/books/${book.key.replace("/works/", "")}`} className="block">
      <div className="flex items-stretch bg-card border border-border/60 rounded-xl overflow-hidden transition-all hover:border-border hover:shadow-sm">
        <div className="w-[68px] shrink-0">
          {book.cover_i ? (
            <img
              src={coverUrl(book.cover_i)}
              alt={book.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full min-h-[92px] bg-gradient-to-br from-primary/70 to-primary/25 flex items-center justify-center text-primary-foreground/70">
              <BookIcon className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="flex-1 p-3.5 flex flex-col">
          <div className="flex-1 space-y-0.5">
            <p className="font-semibold text-[0.9375rem] leading-snug">
              {book.title}
            </p>
            {book.author_name?.[0] && (
              <p className="text-sm text-muted-foreground">
                {book.author_name[0]}
              </p>
            )}
            {book.first_publish_year && (
              <p className="text-xs text-muted-foreground">
                {book.first_publish_year}
              </p>
            )}
          </div>
          <div className="pt-2 flex justify-end gap-1">
            {onPlay && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onPlay(book.key);
                }}
                aria-label="Play"
                className="h-7 text-xs gap-1">
                <Play className="w-3.5 h-3.5" />
                Play
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSaveClick}
              aria-label={saved ? "Remove from reading list" : "Save for later"}
              className="h-7 text-xs gap-1">
              <Bookmark
                className="w-3.5 h-3.5"
                fill={saved ? "currentColor" : "none"}
              />
              {saved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
