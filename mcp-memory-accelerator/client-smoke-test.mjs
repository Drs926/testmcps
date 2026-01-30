import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["src/server.js"],
});

const client = new Client(
  { name: "mcp-memory-accelerator-client", version: "0.0.1" },
  { capabilities: {} }
);

await client.connect(transport);

const tools = await client.listTools();
console.log("TOOLS:", JSON.stringify(tools, null, 2));

const res = await client.callTool({
  name: "memory_index_status",
  arguments: {},
});
console.log("CALL memory.index_status:", JSON.stringify(res, null, 2));

const res2 = await client.callTool({
  name: "memory_search",
  arguments: { query: "MCP", limit: 5 },
});
console.log("CALL memory.search:", JSON.stringify(res2, null, 2));

await client.close();
