Memory V1

Project
- Name: MCP Memory Accelerator V1 (read-only)
- Scope: Index and search /memory only

Goals
- Fast local lookup over memory docs
- Predictable, manual reindexing
- Zero writes to /memory from the MCP server

Constraints
- Cache is only in .mcp-cache/
- Secret-scan: skip + warn on sensitive patterns
- Read-only server behavior for repo files

Notes
- Keep entries concise and dated where relevant.
