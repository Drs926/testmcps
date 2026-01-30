import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { searchMemory } from "./tools/search.js";
import { listRecentMemory } from "./tools/listRecent.js";
import { reindexTool } from "./tools/reindex.js";
import { indexStatus } from "./tools/status.js";

const server = new McpServer({
  name: "mcp-memory-accelerator",
  version: "1.0.0"
});

const transport = new StdioServerTransport();

server.registerTool(
  "memory.search",
  {
    description: "Search /memory using the local FTS index.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        limit: { type: "number" }
      },
      required: ["query"]
    }
  },
  async (input) => {
    try {
      const result = searchMemory(input);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (error) {
      return {
        content: [
          { type: "text", text: JSON.stringify({ ok: false, error: String(error) }) }
        ]
      };
    }
  }
);

server.registerTool(
  "memory.list_recent",
  {
    description: "List recently modified files in /memory with a short preview.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number" }
      }
    }
  },
  async (input) => {
    try {
      const result = listRecentMemory(input);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (error) {
      return {
        content: [
          { type: "text", text: JSON.stringify({ ok: false, error: String(error) }) }
        ]
      };
    }
  }
);

server.registerTool(
  "memory.reindex",
  {
    description: "Rebuild the /memory index in .mcp-cache.",
    inputSchema: { type: "object", properties: {} }
  },
  async () => {
    try {
      const result = reindexTool();
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (error) {
      return {
        content: [
          { type: "text", text: JSON.stringify({ ok: false, error: String(error) }) }
        ]
      };
    }
  }
);

server.registerTool(
  "memory.index_status",
  {
    description: "Return index status and counters.",
    inputSchema: { type: "object", properties: {} }
  },
  async () => {
    try {
      const result = indexStatus();
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    } catch (error) {
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
