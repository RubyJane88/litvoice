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
}

export type SavedBook = LitVoiceDB["savedBooks"]["value"];

const DB_VERSION = 1;
const DB_NAME = "litvoice-db";

function getDB() {
  return openDB<LitVoiceDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore("savedBooks", { keyPath: "key" });
      store.createIndex("by-savedAt", "savedAt");
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
