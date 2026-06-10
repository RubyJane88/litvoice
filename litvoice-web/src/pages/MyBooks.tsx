import { useState, useEffect } from "react";
import { UploadZone } from "@/components/ui/UploadZone";
import { Upload } from "lucide-react";
import { extractText, countWords, getSupportedFormat } from "@/lib/extract";
import { UploadedBookCard } from "@/components/ui/UploadedBookCard";
import type { UploadedBook } from "@/lib/db";
import {
  saveUploadedBook,
  getUploadedBooks,
  removeUploadedBook,
} from "@/lib/db";

export default function MyBooks() {
  const [books, setBooks] = useState<UploadedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load books from IndexedDB on mount
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const savedBooks = await getUploadedBooks();
        setBooks(savedBooks);
      } catch (err) {
        console.error("Failed to load uploaded books:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, []);

  const handleFilesSelected = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      const text = await extractText(file);
      const wordCount = countWords(text);

      const newBook: UploadedBook = {
        id: Date.now().toString(),
        title: file.name,
        format: getSupportedFormat(file.name) || "txt" as const,
        extractedText: text,
        wordCount,
        uploadedAt: Date.now(),
      };

      // Save to IndexedDB
      await saveUploadedBook(newBook);

      // Update UI
      setBooks((prev) => [newBook, ...prev]);
      console.log("✅ Book saved to IndexedDB:", newBook.title);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleListen = (book: UploadedBook) => {
    console.log("🎧 Listening to:", book.title);
    // TODO: Open audio player with book.extractedText
  };

  const handleDelete = async (id: string) => {
    try {
      await removeUploadedBook(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
      console.log("🗑️ Book deleted");
    } catch (err) {
      console.error("Failed to delete book:", err);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Books</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Upload your own books to listen to them here.
        <Upload className="inline-block w-4 h-4 ml-1 mb-1" />
      </p>

      <UploadZone onFilesSelected={handleFilesSelected} />

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          Your Library ({books.length})
        </h2>

        {isLoading ? (
          <p className="text-muted-foreground">Loading your books...</p>
        ) : books.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl">
            <p className="text-muted-foreground italic">
              No books yet. Upload one above!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {books.map((book) => (
              <UploadedBookCard
                key={book.id}
                book={book}
                onListen={handleListen}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
