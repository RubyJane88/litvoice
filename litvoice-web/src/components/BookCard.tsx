import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { coverUrl } from "@/lib/books";
import type { Book } from "@/lib/books";
import { Link } from "react-router";
import { isBookSaved, saveBook, removeBook } from "@/lib/db";
import type { SavedBook } from "@/lib/db";

type Props = {
  book: Book;
  onToggleSave?: (key: string, saved: boolean) => void;
};

export function BookCard({ book, onToggleSave }: Props) {
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
        if (onToggleSave) {
          onToggleSave(book.key, nextSaved);
        }
      } catch (err) {
        console.error("Failed to update reading list:", err);
        setSaved(saved); // Rollback
      }
    },
    [book, saved],
  );

  return (
    <Link
      to={`/books/${book.key.replace("/works/", "")}`}
      className="block no-underline">
      <Card className="h-full flex flex-col overflow-hidden hover:bg-muted/50 transition-colors group">
        <div className="flex flex-row gap-4 p-4 flex-1">
          <div className="w-20 shrink-0">
            {book.cover_i ? (
              <img
                src={coverUrl(book.cover_i)}
                alt={book.title}
                loading="lazy"
                className="w-full rounded shadow-sm"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                No cover
              </div>
            )}
          </div>
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="flex-1 space-y-1">
              <p className="font-semibold leading-tight">{book.title}</p>
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
            <div className="pt-2 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSaveClick}
                aria-label={
                  saved ? "Remove from reading list" : "Save for later"
                }
                className="text-xs gap-1">
                <Bookmark
                  className="w-4 h-4"
                  fill={saved ? "currentColor" : "none"}
                />
                {saved ? "Saved" : "Save"}
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
