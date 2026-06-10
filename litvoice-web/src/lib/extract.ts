export type SupportedFormat = "txt" | "md" | "pdf" | "epub" | "docx";

/**
 * Maximum allowed file size (10 MB in bytes).
 * Prevents memory issues and abuse when processing files client-side.
 */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function getSupportedFormat(filename: string): SupportedFormat | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "txt": return "txt";
    case "md": return "md";
    case "pdf": return "pdf";
    case "epub": return "epub";
    case "docx": return "docx";
    default: return null;
  }
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateReadingMinutes(wordCount: number): number {
  return Math.ceil(wordCount / 238);
}

export function estimateListeningMinutes(wordCount: number): number {
  return Math.ceil(wordCount / 150);
}

/**
 * Validates file size before processing.
 * @throws Error if file is too large
 */
function validateFileSize(file: File): void {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). ` +
      `Maximum allowed size is 10 MB.`
    );
  }
}




async function extractTxt(file: File): Promise<string> {
  return file.text();
}

async function extractMd(file: File): Promise<string> {
  const raw = await file.text();
  return raw
    .replace(/#{1,6}\s+/g, "")         // headings
    .replace(/\*\*(.+?)\*\*/g, "$1")   // bold
    .replace(/\*(.+?)\*/g, "$1")       // italic
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // links
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // code
    .replace(/^\s*[-*+]\s+/gm, "")     // list items
    .replace(/^\s*>\s+/gm, "")         // blockquotes
    .trim();
}

export async function extractText(file: File): Promise<string> {
  const format = getSupportedFormat(file.name);
  if (!format) throw new Error(`Unsupported file format: ${file.name}`);

  switch (format) {
    case "txt": return extractTxt(file);
    case "md": return extractMd(file);
    case "pdf":
    case "epub":
    case "docx":
      throw new Error(`${format.toUpperCase()} support coming soon`);
  }
}