import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/build-app.js";
import type { SearchResult } from "../src/modules/books/books.schema.js";

const app = buildApp();

// Stub fetch so tests never hit the real network
const originalFetch = globalThis.fetch;

before(() => {
  globalThis.fetch = async (url: string | URL | Request) => {
    const urlStr = url.toString();
    if (urlStr.includes("/works/INVALID000")) {
      return new Response(JSON.stringify({ error: "notfound" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ error: "notfound" }), { status: 404 });
  };
});

after(() => {
  globalThis.fetch = originalFetch;
});

describe("GET /books/search", () => {
  it("returns 422 when q is missing", async () => {
    const res = await app.request("/books/search");
    assert.equal(res.status, 422);
  });

  it("returns 422 when q is empty", async () => {
    const res = await app.request("/books/search?q=");
    assert.equal(res.status, 422);
  });

  it("returns 422 when limit exceeds 50", async () => {
    const res = await app.request("/books/search?q=test&limit=100");
    assert.equal(res.status, 422);
  });
});

describe("Books routes", () => {
  it("returns 404 for a nonexistent olid", async () => {
    const res = await app.request("/books/INVALID000");
    assert.equal(res.status, 404);
  });

  describe("GET /books/search happy path", () => {
    before(() => {
      globalThis.fetch = async () => {
        return new Response(
          JSON.stringify({
            numFound: 1,
            offset: null,
            docs: [
              {
                key: "/works/OL1W",
                title: "Test Book",
                author_name: ["Author"],
              },
            ],
          }),
          { status: 200 },
        );
      };
    });

    it("returns 200 with results for a valid query", async () => {
      const res = await app.request("/books/search?q=test");
      assert.equal(res.status, 200);
      const body = (await res.json()) as SearchResult;
      assert.equal(body.numFound, 1);
      assert.ok(body.docs[0], "docs array should have at least one item");
      assert.equal(body.docs[0].title, "Test Book");
    });
  });
});
