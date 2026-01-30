import fs from "node:fs";
import { createSchema, findRepoRoot, getMeta, getPaths, openDb } from "../db.js";

export function indexStatus() {
  const repoRoot = findRepoRoot();
  const { dbPath } = getPaths(repoRoot);
  if (!fs.existsSync(dbPath)) {
    return {
      ok: true,
      repo_root: repoRoot,
      db_path: dbPath,
      docs_count: 0,
      chunks_count: 0,
      last_reindex_at: null
    };
  }
  const db = openDb(dbPath);
  createSchema(db);

  const docsCount = db.prepare("SELECT COUNT(*) AS count FROM docs").get()?.count ?? 0;
  const chunksCount = db.prepare("SELECT COUNT(*) AS count FROM chunks").get()?.count ?? 0;
  const lastReindexAt = getMeta(db, "last_reindex_at");

  return {
    ok: true,
    repo_root: repoRoot,
    db_path: dbPath,
    docs_count: docsCount,
    chunks_count: chunksCount,
    last_reindex_at: lastReindexAt
  };
}
