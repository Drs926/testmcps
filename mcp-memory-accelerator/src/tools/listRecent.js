import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import { z } from "zod";
import { findRepoRoot, getPaths } from "../db.js";

const inputSchema = z.object({
  limit: z.number().int().min(1).max(50).optional()
});

function normalizePath(p) {
  return p.replace(/\\/g, "/");
}

function previewLines(text, maxLines) {
  const lines = text.split(/\r?\n/);
  return lines.slice(0, maxLines).join("\n");
}

export function listRecentMemory(input) {
  const { limit } = inputSchema.parse(input ?? {});
  const repoRoot = findRepoRoot();
  const { memoryDir } = getPaths(repoRoot);
  if (!fs.existsSync(memoryDir)) {
    return { ok: false, error: "memory directory not found", repo_root: repoRoot };
  }

  const files = fg.sync("**/*", {
    cwd: memoryDir,
    onlyFiles: true,
    dot: true,
    followSymbolicLinks: false
  });

  const items = files
    .map((relPath) => {
      const absPath = path.join(memoryDir, relPath);
      const stats = fs.statSync(absPath);
      const content = fs.readFileSync(absPath, "utf8");
      return {
        path: normalizePath(path.join("memory", relPath)),
        mtime: stats.mtime.toISOString(),
        preview: previewLines(content, 30)
      };
    })
    .sort((a, b) => (a.mtime < b.mtime ? 1 : -1))
    .slice(0, limit ?? 10);

  return { ok: true, results: items };
}
