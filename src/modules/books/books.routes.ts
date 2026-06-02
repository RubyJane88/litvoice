import { z } from "zod";
import { NotFoundError } from "@daloyjs/core";
import type { App } from "@daloyjs/core";
import { searchBooksService, getBookService } from "./books.service.js";
import { BookSchema, SearchResultSchema } from "./books.schema.js";

export function registerBooksRoutes(app: App): void {
  app.route({
    method: "GET",
    path: "/books/search",
    operationId: "searchBooks",
    tags: ["Books"],
    request: {
      query: z
        .object({
          q: z.string().min(1),
          limit: z.coerce.number().min(1).max(50).optional(),
        })
        .strict(),
    },
    responses: {
      200: { description: "Search results", body: SearchResultSchema },
      422: { description: "Validation error" },
    },
    handler: async ({ query }) => {
      const results = await searchBooksService(query.q, query.limit);
      return { status: 200 as const, body: results };
    },
  });

  app.route({
    method: "GET",
    path: "/books/:olid",
    operationId: "getBookById",
    tags: ["Books"],
    request: {
      params: z.object({ olid: z.string().min(1) }).strict(),
    },
    responses: {
      200: { description: "Book found", body: BookSchema },
      404: { description: "Not found" },
    },
    handler: async ({ params }) => {
      try {
        const book = await getBookService(params.olid);
        return { status: 200 as const, body: book };
      } catch (err) {
        const status = (err as { status?: number }).status;
        if (status === 404)
          throw new NotFoundError(`Book with OLID ${params.olid} not found`);
        throw err;
      }
    },
  });
}
