import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchMemory } from "./tools/search.js";
import { listRecentMemory } from "./tools/listRecent.js";
import { reindexTool } from "./tools/reindex.js";
import { indexStatus } from "./tools/status.js";

const LOG_LEVEL = process.env.LOG_LEVEL || "info";

function log(level, payload) {
  if (level === "debug" && LOG_LEVEL !== "debug") return;
  console.error(JSON.stringify({
    ts: new Date().toISOString(),
    level,
    ...payload
  }));
}

const server = new McpServer({
  name: "mcp-memory-accelerator",
  version: "1.0.0"
});

const transport = new StdioServerTransport();

server.registerTool(
  "memory_search",
  {
    description: "Search /memory using the local FTS index.",
    inputSchema: z.object({
      query: z.string(),
      limit: z.number().optional()
    })
  },
  async (input) => {
    try {
      const result = searchMemory(input);
      log("info", { tool: "memory_search", ok: true });
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (error) {
      log("error", { tool: "memory_search", error: String(error) });
      return {
        content: [
          { type: "text", text: JSON.stringify({ ok: false, error: String(error) }) }
        ]
      };
    }
  }
);

server.registerTool(
  "memory_list_recent",
  {
    description: "List recently modified files in /memory with a short preview.",
    inputSchema: z.object({
      limit: z.number().optional()
    })
  },
  async (input) => {
    try {
      const result = listRecentMemory(input);
      log("info", { tool: "memory_list_recent", ok: true });
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (error) {
      log("error", { tool: "memory_list_recent", error: String(error) });
      return {
        content: [
          { type: "text", text: JSON.stringify({ ok: false, error: String(error) }) }
        ]
      };
    }
  }
);

server.registerTool(
  "memory_reindex",
  {
    description: "Rebuild the /memory index in .mcp-cache.",
    inputSchema: z.object({})
  },
  async () => {
    try {
      const result = reindexTool();
      log("info", { tool: "memory_reindex", ok: true });
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (error) {
      log("error", { tool: "memory_reindex", error: String(error) });
      return {
        content: [
          { type: "text", text: JSON.stringify({ ok: false, error: String(error) }) }
        ]
      };
    }
  }
);

server.registerTool(
  "memory_index_status",
  {
    description: "Return index status and counters.",
    inputSchema: z.object({})
  },
  async () => {
    try {
      const result = indexStatus();
      log("info", { tool: "memory_index_status", ok: true });
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (error) {
      log("error", { tool: "memory_index_status", error: String(error) });
      return {
        content: [
          { type: "text", text: JSON.stringify({ ok: false, error: String(error) }) }
        ]
      };
    }
  }
);

let closing = false;
const shutdown = async () => {
  if (closing) return;
  closing = true;
  await server.close();
};

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});

await server.connect(transport);
