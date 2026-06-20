import { z } from "zod";
import { App, cors, rateLimit, requestId, secureHeaders } from "@daloyjs/core";

import { registerBooksRoutes } from "./modules/books/books.routes.js";

export function buildApp(): App {
  const app = new App({
    bodyLimitBytes: 1024 * 1024,
    requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS ?? 10_000),
    production: process.env.NODE_ENV === "production",
    trustProxy: true,
    openapi: {
      servers: [{ url: `http://localhost:${process.env.PORT ?? 3000}` }],
    },
    docs: true,
  });

  app.use(requestId());
  app.use(
    cors({
      origin: (process.env.CORS_ORIGIN ?? "http://localhost:5173").split(","),
    }),
  );
  app.use(secureHeaders());
  app.use(rateLimit({ windowMs: 60_000, max: 120 }));

  registerBooksRoutes(app);

  app.route({
    method: "GET",
    path: "/healthz",
    operationId: "healthz",
    tags: ["Ops"],
    responses: {
      200: {
        description: "Service is healthy",
        body: z.object({ ok: z.literal(true), uptime: z.number() }),
      },
    },
    handler: async () => ({
      status: 200,
      body: { ok: true as const, uptime: process.uptime() },
    }),
  });

  return app;
}

export default buildApp;
