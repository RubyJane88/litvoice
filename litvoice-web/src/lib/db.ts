import { openDB, type DBSchema } from "idb";

interface LitVoiceDB extends DBSchema {
  savedBooks: {
    key: string; // OLID
    value: {
      key: string;
      title: string;
      author_name: string[];
      cover_i?: number | null;
      description?: string;
      first_publish_year?: number;
      savedAt: number; // timestamp
      currentPosition?: number; // in seconds, for TTS progress persistence
    };
    indexes: { "by-savedAt": number };
  };

  uploadedBooks: {
    key: string; // UUID
    value: {
      id: string;
      title: string; // editable, defaults to filename
      format: "txt" | "md" | "pdf" | "epub" | "docx";
      extractedText: string;
      wordCount: number; // derived at extraction time
      uploadedAt: number;
      currentPosition?: number;
    };
    indexes: { "by-uploadedAt": number };
  };
}

export type SavedBook = LitVoiceDB["savedBooks"]["value"];
export type UploadedBook = LitVoiceDB["uploadedBooks"]["value"];

const DB_VERSION = 2;
const DB_NAME = "litvoice-db";

function getDB() {
  return openDB<LitVoiceDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const savedStore = db.createObjectStore("savedBooks", {
          keyPath: "key",
        });
        savedStore.createIndex("by-savedAt", "savedAt");
      }
      if (oldVersion < 2) {
        const uploadedStore = db.createObjectStore("uploadedBooks", {
          keyPath: "id",
        });
        uploadedStore.createIndex("by-uploadedAt", "uploadedAt");
      }
    },
  });
}

export async function saveBook(
  book: LitVoiceDB["savedBooks"]["value"],
): Promise<void> {
  const db = await getDB();
  await db.put("savedBooks", book);
}

export async function removeBook(key: string): Promise<void> {
  const db = await getDB();
  await db.delete("savedBooks", key);
}

export async function getSavedBooks(): Promise<
  LitVoiceDB["savedBooks"]["value"][]
> {
  const db = await getDB();
  return db.getAll("savedBooks");
}

export async function isBookSaved(key: string): Promise<boolean> {
  const db = await getDB();
  const book = await db.get("savedBooks", key);
  return book !== undefined;
}

export async function saveUploadedBook(book: UploadedBook): Promise<void> {
  const db = await getDB();
  await db.put("uploadedBooks", book);
}

export async function removeUploadedBook(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("uploadedBooks", id);
}

export async function getUploadedBooks(): Promise<UploadedBook[]> {
  const db = await getDB();
  return db.getAll("uploadedBooks");
}

export async function updateUploadedBookTitle(id: string, title: string): Promise<void> {
  const db = await getDB();
  const book = await db.get("uploadedBooks", id);
  if (book) {
    await db.put("uploadedBooks", { ...book, title });
  }
}