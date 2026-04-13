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

const app = express();

const server = new McpServer({
  name: "freshservice-mcp",
  version: "1.0.0"
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

const transport = new StreamableHTTPServerTransport();

async function start() {

  await server.connect(transport);

  // IMPORTANT: mount MCP route BEFORE any middleware
  app.all("/mcp", (req, res) => {
    transport.handleRequest(req, res);
  });
  
  app.get("/.well-known/mcp", (_req, res) => {
  res.json({
    name: "freshservice-mcp",
    version: "1.0.0",
    transport: {
      type: "streamable-http",
      endpoint: "/mcp"
    }
  });
});

  // health route AFTER MCP route
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  const port = Number(process.env.PORT) || 8080;

  app.listen(port, () => {
    console.log(`Freshservice MCP server running on port ${port}`);
  });

}

start();