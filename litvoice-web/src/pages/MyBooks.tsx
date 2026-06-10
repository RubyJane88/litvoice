import { useState, useEffect } from "react";
import { UploadZone } from "@/components/ui/UploadZone";
import { Upload, BookOpen } from "lucide-react";
import {
  extractText,
  countWords,
  getSupportedFormat,
} from "@/lib/extract";
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

  // Load books from IndexedDB
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const savedBooks = await getUploadedBooks();
        setBooks(savedBooks.sort((a, b) => b.uploadedAt - a.uploadedAt)); // newest first
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
        format: getSupportedFormat(file.name) || "txt",
        extractedText: text,
        wordCount,
        uploadedAt: Date.now(),
      };

      await saveUploadedBook(newBook);
      setBooks((prev) => [newBook, ...prev]);
      console.log("✅ Book saved:", newBook.title);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleListen = (book: UploadedBook) => {
    console.log("🎧 Start listening to:", book.title);
    // TODO: Implement audio player in next step
    alert(`🎧 Would play audio for "${book.title}" (${book.wordCount} words)`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this book?")) return;

    try {
      await removeUploadedBook(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      console.error("Failed to delete book:", err);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">My Books</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Upload your own books to listen to them here.
      </p>

      <UploadZone onFilesSelected={handleFilesSelected} />

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
          <BookOpen className="w-5 h-5" />
          Your Library ({books.length})
        </h2>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-16 border border-dashed rounded-2xl">
            <BookOpen className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground italic">
              No books yet. Upload your first one above!
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
