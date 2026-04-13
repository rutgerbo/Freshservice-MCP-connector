import "dotenv/config";
import express from "express";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { registerTicketTools } from "./tools/tickets.js";
import { registerProblemTools } from "./tools/problems.js";
import { registerChangeTools } from "./tools/changes.js";
import { registerAssetTools } from "./tools/assets.js";
import { registerServiceCatalogTools } from "./tools/serviceCatalog.js";
import { registerWorkflowTools } from "./tools/workflows.js";
import { registerRelationshipTools } from "./tools/relationships.js";
import { registerSearchTools } from "./tools/search.js";
import { registerSyncTools } from "./tools/sync.js";
import { registerConfigureInstanceTool } from "./tools/configureInstance.js";

const server = new McpServer({
  name: "freshservice-mcp",
  version: "1.0.0",
});

registerTicketTools(server);
registerProblemTools(server);
registerChangeTools(server);
registerAssetTools(server);
registerServiceCatalogTools(server);
registerWorkflowTools(server);
registerRelationshipTools(server);
registerSearchTools(server);
registerSyncTools(server);
registerConfigureInstanceTool(server);

const app = express();
app.use(express.json());

const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined,
});

server.connect(transport);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.all("/mcp", async (req, res) => {
  await transport.handleRequest(req, res, req.body);
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Freshservice MCP server listening on port ${port}`);
});