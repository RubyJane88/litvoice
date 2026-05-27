import { z } from "zod";
import {
  App,
  rateLimit,
  requestId,
  secureHeaders,
} from "@daloyjs/core";

export function buildApp(): App {
  const app = new App({
    bodyLimitBytes: 1024 * 1024,
    requestTimeoutMs: 5_000,
    production: process.env.NODE_ENV === "production",
    openapi: {
      servers: [{ url: `http://localhost:${process.env.PORT ?? 3000}` }],
    },
    docs: true,
  });

  app.use(requestId());
  app.use(secureHeaders());
  app.use(rateLimit({ windowMs: 60_000, max: 120 }));

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