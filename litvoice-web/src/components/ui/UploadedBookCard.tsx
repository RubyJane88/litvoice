import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Trash2 } from "lucide-react";
import type { UploadedBook } from "@/lib/db";

type UploadedBookCardProps = {
  book: UploadedBook;
  onListen: (book: UploadedBook) => void;
  onDelete: (id: string) => void;
};

export function UploadedBookCard({
  book,
  onListen,
  onDelete,
}: UploadedBookCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex justify-between items-start gap-4">
          <span className="line-clamp-2 flex-1">{book.title}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(book.id)}
            className="text-destructive hover:text-destructive/80 shrink-0">
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <p>{book.wordCount.toLocaleString()} words</p>
          <p>~{Math.ceil(book.wordCount / 150)} min read</p>
          <p>Uploaded: {new Date(book.uploadedAt).toLocaleDateString()}</p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 border-l-2 border-muted pl-4">
          {book.extractedText.substring(0, 280)}...
        </p>

        <Button onClick={() => onListen(book)} className="w-full" size="lg">
          <Play className="mr-2 h-5 w-5" />
          Listen Now
        </Button>
      </CardContent>
    </Card>
  );
}
