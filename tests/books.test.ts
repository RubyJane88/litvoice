import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildApp } from "../src/build-app.js";

const app = buildApp();

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

describe("GET /books/:olid", () => {
  it("returns 404 for a nonexistent olid", async () => {
    const res = await app.request("/books/INVALID000");
    assert.equal(res.status, 404);
  });
});