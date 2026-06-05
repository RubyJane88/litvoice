import { z } from "zod";
import { NotFoundError } from "@daloyjs/core";
import type { App } from "@daloyjs/core";
import { searchBooksService, getBookService } from "./books.service.js";
import { BookSchema, SearchResultSchema } from "./books.schema.js";

const UpstreamErrorSchema = z.object({
  message: z.string(),
});

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
      503: { description: "Upstream service unavailable", body: UpstreamErrorSchema },
      504: { description: "Upstream request timed out", body: UpstreamErrorSchema },
    },
    handler: async ({ query }) => {
      try {
        const results = await searchBooksService(query.q, query.limit);
        return { status: 200 as const, body: results };
      } catch (err) {
        const status = (err as { status?: number }).status;
        if (status === 503)
          return { status: 503 as const, body: { message: "Upstream service unavailable" } };
        if (status === 504)
          return { status: 504 as const, body: { message: "Upstream request timed out" } };
        throw err;
      }
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
      503: { description: "Upstream service unavailable", body: UpstreamErrorSchema },
      504: { description: "Upstream request timed out", body: UpstreamErrorSchema },
    },
    handler: async ({ params }) => {
      try {
        const book = await getBookService(params.olid);
        return { status: 200 as const, body: book };
      } catch (err) {
        const status = (err as { status?: number }).status;
        if (status === 404)
          throw new NotFoundError(`Book with OLID ${params.olid} not found`);
        if (status === 503)
          return { status: 503 as const, body: { message: "Upstream service unavailable" } };
        if (status === 504)
          return { status: 504 as const, body: { message: "Upstream request timed out" } };
        throw err;
      }
    },
  });
}
