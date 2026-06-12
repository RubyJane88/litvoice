import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Trash2, Check, X } from "lucide-react";
import { usePlayer } from "@/context/playerContext";
import type { UploadedBook } from "@/lib/db";
import { updateUploadedBookPosition } from "@/lib/db";

type UploadedBookCardProps = {
  book: UploadedBook;
  onDelete: (id: string) => void;
  onTitleUpdate?: (id: string, newTitle: string) => void;
};

export function UploadedBookCard({
  book,
  onDelete,
  onTitleUpdate,
}: UploadedBookCardProps) {
  const { startPlaying } = usePlayer();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(book.title);

  const handleSaveTitle = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== book.title && onTitleUpdate) {
      onTitleUpdate(book.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(book.title);
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden hover:bg-muted/2 hover:border-amber-500 transition-all duration-200 hover:shadow-lg group border border-border/50">
      <CardHeader>
        <CardTitle className="flex justify-between items-start gap-4">
          {isEditing ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") handleCancel();
                }}
                onBlur={handleSaveTitle}
                className="flex-1 bg-transparent border-b border-amber-500 focus:outline-none text-lg font-medium"
                autoFocus
              />
              <Button size="sm" variant="ghost" onClick={handleSaveTitle}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <span
              className="line-clamp-2 flex-1 cursor-pointer hover:text-amber-500 transition-colors"
              onClick={() => setIsEditing(true)}>
              {book.title}
            </span>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(book.id)}
            className="text-destructive hover:text-destructive/80 shrink-0 opacity-70 group-hover:opacity-100">
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <p>{book.wordCount.toLocaleString()} words</p>
          <p>~{Math.ceil(book.wordCount / 150)} min listen</p>
          <p>Uploaded: {new Date(book.uploadedAt).toLocaleDateString()}</p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 border-l-2 border-muted pl-4">
          {book.extractedText.substring(0, 280)}...
        </p>

        <Button
          onClick={() =>
            startPlaying({
              text: book.extractedText,
              title: book.title,
              startPosition: book.currentPosition ?? 0,
              onPositionChange: (pos) =>
              updateUploadedBookPosition(book.id, pos),
            })
          }
          className="w-full"
          size="lg">
          <Play className="mr-2 h-5 w-5" />
          {book.currentPosition ? "Resume" : "Listen Now"}
        </Button>
      </CardContent>
    </Card>
  );
}
