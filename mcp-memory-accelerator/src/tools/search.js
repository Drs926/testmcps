import fs from "node:fs";
import { z } from "zod";
import { createSchema, findRepoRoot, getPaths, openDb } from "../db.js";

const inputSchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(50).optional()
});

export function searchMemory(input) {
  input = input ?? {};
  const MAX_LIMIT = 20;
  if (!input.query || input.query.trim().length < 2) {
    throw new Error("Query must contain at least 2 characters");
  }
  const limit = Math.min(input.limit ?? 5, MAX_LIMIT);

  const { query } = inputSchema.parse({ ...input, limit });
  const repoRoot = findRepoRoot();
  const { dbPath } = getPaths(repoRoot);
  if (!fs.existsSync(dbPath)) {
    return { ok: true, results: [], warning: "index not found; run memory.reindex" };
  }
  const db = openDb(dbPath);
  createSchema(db);

  const rows = db
    .prepare(
      `SELECT
        chunks.path AS path,
        snippet(chunks_fts, 0, '[', ']', '...', 12) AS snippet,
        bm25(chunks_fts) AS score,
        chunks.start_line AS start_line,
        chunks.end_line AS end_line,
        chunks.updated_at AS updated_at
      FROM chunks_fts
      JOIN chunks ON chunks.id = chunks_fts.chunk_id
      WHERE chunks_fts MATCH ?
      ORDER BY score
      LIMIT ?`
    )
    .all(query, limit);

  return { ok: true, results: rows };
}
