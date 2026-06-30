import { z } from "zod";

export const BookSchema = z.object({
  key: z.string(),
  title: z.string(),
  author_name: z.array(z.string()).optional(),
  cover_i: z.number().optional(),
  first_publish_year: z.number().optional(),
  edition_count: z.number().optional(),
  language: z.array(z.string()).optional(),
  ebook_access: z.string().optional(),
  description: z.string().optional(),
});

export const SearchResultSchema = z.object({
  numFound: z.number(),
  offset: z.number().nullable().optional(),
  docs: z.array(BookSchema),
});

export type Book = z.infer<typeof BookSchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
