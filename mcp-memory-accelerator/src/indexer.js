import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import {
  createSchema,
  ensureCacheDir,
  findRepoRoot,
  getPaths,
  openDb,
  resetSchema,
  setMeta
} from "./db.js";

const SECRET_PATTERNS = [
  /BEGIN (RSA|EC|OPENSSH) PRIVATE KEY/i,
  /\bAPI[_-]?KEY\b/i,
  /\bSECRET[_-]?KEY\b/i,
  /\bPASSWORD\b/i,
  /\bTOKEN\b/i
];

function normalizePath(p) {
  return p.replace(/\\/g, "/");
}

function detectSecret(text) {
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) {
      return pattern.toString();
    }
  }
  return null;
}

export function chunkText(text, options = {}) {
  const minLines = options.minLines ?? 200;
  const maxLines = options.maxLines ?? 600;
  const minChars = options.minChars ?? 2000;
  const maxChars = options.maxChars ?? 6000;
  const lines = text.split(/\r?\n/);
  if (lines.length === 1 && lines[0] === "") {
    return [];
  }

  const chunks = [];
  let i = 0;
  while (i < lines.length) {
    const startIndex = i;
    let lineCount = 0;
    let charCount = 0;
    while (i < lines.length) {
      const nextLine = lines[i];
      const nextChars = nextLine.length + 1;
      if (lineCount >= minLines || charCount >= minChars) {
        if (lineCount + 1 > maxLines || charCount + nextChars > maxChars) {
          break;
        }
      }
      lineCount += 1;
      charCount += nextChars;
      i += 1;
      if (lineCount >= maxLines || charCount >= maxChars) {
        break;
      }
    }
    if (lineCount === 0) {
      lineCount = 1;
      i = startIndex + 1;
    }
    const endIndex = startIndex + lineCount - 1;
    const content = lines.slice(startIndex, endIndex + 1).join("\n");
    chunks.push({
      start_line: startIndex + 1,
      end_line: endIndex + 1,
      content
    });
  }
  return chunks;
}

export function reindexMemory() {
  const repoRoot = findRepoRoot();
  const { memoryDir, cacheDir, dbPath } = getPaths(repoRoot);
  if (!fs.existsSync(memoryDir)) {
    return {
      ok: false,
      error: "memory directory not found",
      repo_root: repoRoot
    };
  }

  ensureCacheDir(cacheDir);
  const db = openDb(dbPath);
  resetSchema(db);
  createSchema(db);

  const docStmt = db.prepare(
    "INSERT INTO docs (path, mtime, size, updated_at, line_count) VALUES (?, ?, ?, ?, ?)"
  );
  const chunkStmt = db.prepare(
    "INSERT INTO chunks (doc_id, path, start_line, end_line, content, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const ftsStmt = db.prepare(
    "INSERT INTO chunks_fts (content, path, start_line, end_line, chunk_id) VALUES (?, ?, ?, ?, ?)"
  );

  const warnings = [];
  const skipped = [];
  let docsCount = 0;
  let chunksCount = 0;

  const files = fg.sync("**/*", {
    cwd: memoryDir,
    onlyFiles: true,
    dot: true,
    followSymbolicLinks: false
  });

  const insertAll = db.transaction(() => {
    for (const relPath of files) {
      const absPath = path.join(memoryDir, relPath);
      const stats = fs.statSync(absPath);
      const content = fs.readFileSync(absPath, "utf8");
      const secretMatch = detectSecret(content);
      if (secretMatch) {
        const rel = normalizePath(path.join("memory", relPath));
        skipped.push(rel);
        warnings.push(`Skipped ${rel} due to secret pattern ${secretMatch}`);
        continue;
      }

      const rel = normalizePath(path.join("memory", relPath));
      const mtime = stats.mtimeMs;
      const updatedAt = stats.mtime.toISOString();
      const lines = content === "" ? [""] : content.split(/\r?\n/);
      const docResult = docStmt.run(rel, mtime, stats.size, updatedAt, lines.length);
      const docId = Number(docResult.lastInsertRowid);
      docsCount += 1;

      const chunks = chunkText(content);
      for (const chunk of chunks) {
        const chunkResult = chunkStmt.run(
          docId,
          rel,
          chunk.start_line,
          chunk.end_line,
          chunk.content,
          updatedAt
        );
        const chunkId = Number(chunkResult.lastInsertRowid);
        ftsStmt.run(chunk.content, rel, chunk.start_line, chunk.end_line, chunkId);
        chunksCount += 1;
      }
    }
  });

  insertAll();

  const lastReindexAt = new Date().toISOString();
  setMeta(db, "last_reindex_at", lastReindexAt);
  setMeta(db, "repo_root", repoRoot);
  setMeta(db, "db_path", dbPath);
  setMeta(db, "memory_dir", memoryDir);
  setMeta(db, "docs_count", String(docsCount));
  setMeta(db, "chunks_count", String(chunksCount));

  return {
    ok: true,
    repo_root: repoRoot,
    memory_dir: memoryDir,
    db_path: dbPath,
    docs_indexed: docsCount,
    chunks_indexed: chunksCount,
    skipped_files: skipped,
    warnings,
    last_reindex_at: lastReindexAt
  };
}
