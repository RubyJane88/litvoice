import { useState } from "react";
import { UploadZone } from "@/components/ui/UploadZone";
import { Upload } from "lucide-react";
import { extractText, countWords, estimateReadingMinutes } from "@/lib/extract";

interface UploadedBook {
  id: string;
  name: string;
  wordCount: number;
  estimatedReadingMinutes: number;
  text: string; // we'll use this later for TTS
  uploadedAt: Date;
}

export default function MyBooks() {
  const [books, setBooks] = useState<UploadedBook[]>([]);

  const handleFilesSelected = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      const text = await extractText(file);
      const wordCount = countWords(text);

      const newBook: UploadedBook = {
        id: Date.now().toString(),
        name: file.name,
        wordCount,
        estimatedReadingMinutes: estimateReadingMinutes(wordCount),
        text,
        uploadedAt: new Date(),
      };

      setBooks((prev) => [newBook, ...prev]); // add to top

      console.log("✅ Book added:", newBook.name);
    } catch (err: any) {
      alert("Error: " + err.message);
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

      {/* Uploaded Books List */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">
          Your Library ({books.length})
        </h2>

        {books.length === 0 ? (
          <p className="text-muted-foreground italic">
            No books yet. Upload one above!
          </p>
        ) : (
          <div className="space-y-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="p-6 border rounded-xl bg-card hover:bg-accent/50 transition-colors">
                <h3 className="font-medium text-lg mb-2">{book.name}</h3>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <p>{book.wordCount.toLocaleString()} words</p>
                  <p>~{book.estimatedReadingMinutes} min read</p>
                  <p>Uploaded: {book.uploadedAt.toLocaleDateString()}</p>
                </div>
                <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                  {book.text.substring(0, 200)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
