MCP Memory Accelerator V1 (read-only)

Overview
- Indexes /memory only.
- Stores DB cache in /.mcp-cache (gitignored).
- Reindex is manual only.

Setup
- npm install
- npm run dev

Tools
- memory.search: Search FTS index for a query.
- memory.list_recent: List recent memory files (mtime order).
- memory.reindex: Rebuild index for /memory.
- memory.index_status: Report counts and last reindex time.

Notes
- The server never writes to /memory.
- If secrets are detected, files are skipped with warnings.
