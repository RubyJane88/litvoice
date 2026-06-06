import { Card, CardContent } from "@/components/ui/card";
import { coverUrl } from "@/lib/books";
import type { Book } from "@/lib/books";
import { Link } from "react-router";

type Props = {
  book: Book;
};

export function BookCard({ book }: Props) {
  return (
    <Link
      to={`/books/${book.key.replace("/works/", "")}`}
      className="no-underline">
      <Card className="flex gap-4 p-4">
        <div className="w-16 shrink-0">
          {book.cover_i ? (
            <img
              src={coverUrl(book.cover_i)}
              alt={book.title}
              loading="lazy"
              className="w-full rounded"
            />
          ) : (
            <div className="w-full h-24 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
              No cover
            </div>
          )}
        </div>
        <CardContent className="p-0 flex flex-col gap-1">
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
        </CardContent>
      </Card>
    </Link>
  );
}
