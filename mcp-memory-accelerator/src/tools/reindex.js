import { reindexMemory } from "../indexer.js";

let reindexInProgress = false;

export function reindexTool() {
  if (reindexInProgress) {
    throw new Error("Reindex already running");
  }
  reindexInProgress = true;
  try {
    return reindexMemory();
  } finally {
    reindexInProgress = false;
  }
}
