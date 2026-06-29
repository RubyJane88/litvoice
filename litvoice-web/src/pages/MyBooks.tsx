import { useState, useEffect } from "react";
import { UploadZone } from "@/components/ui/UploadZone";
import { Library } from "lucide-react";
import { extractText, countWords, getSupportedFormat } from "@/lib/extract";
import { UploadedBookCard } from "@/components/ui/UploadedBookCard";
import {
  saveUploadedBook,
  getUploadedBooks,
  removeUploadedBook,
  UploadedBook,
} from "@/lib/db";

export default function MyBooks() {
  const [books, setBooks] = useState<UploadedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const savedBooks = await getUploadedBooks();
        setBooks(savedBooks.sort((a, b) => b.uploadedAt - a.uploadedAt));
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
    } catch (err: any) {
      alert("Error: " + err.message);
    }
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

  const handleTitleUpdate = async (id: string, newTitle: string) => {
    try {
      const bookToUpdate = books.find((b) => b.id === id);
      if (bookToUpdate) {
        const updatedBook = { ...bookToUpdate, title: newTitle };
        await saveUploadedBook(updatedBook);
        setBooks((prev) =>
          prev.map((book) => (book.id === id ? updatedBook : book)),
        );
      }
    } catch (err) {
      console.error("Failed to update title:", err);
      alert("Failed to update title. Please try again.");
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold mb-1">My Books</h1>
        <p className="text-sm text-muted-foreground">
          Upload a PDF, EPUB, or DOCX. Files never leave your device.
        </p>
      </div>

      <UploadZone onFilesSelected={handleFilesSelected} />

      <div className="mt-10">
        <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">
          On this device
        </p>

        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Loading your books…
          </p>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4 text-primary">
              <Library className="w-6 h-6" />
            </div>
            <p className="font-semibold text-sm mb-1">No books yet</p>
            <p className="text-sm text-muted-foreground">
              Upload a file above to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {books.map((book) => (
              <UploadedBookCard
                key={book.id}
                book={book}
                onDelete={handleDelete}
                onTitleUpdate={handleTitleUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
