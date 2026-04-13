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

/**
 * REQUIRED: CORS for Claude Web connector handshake
 */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});

app.options("/.well-known/mcp", (_req, res) => res.sendStatus(200));
app.options("/mcp", (_req, res) => res.sendStatus(200));;

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

  /**
   * MCP transport endpoint
   */
  app.all("/mcp", (req, res) => {
    transport.handleRequest(req, res);
  });

  /**
   * MCP discovery endpoint (required by Claude Web)
   */
  app.get("/.well-known/mcp", (_req, res) => {
    res.json({
      name: "freshservice-mcp",
      version: "1.0.0",
      capabilities: {
        tools: {}
      },
      transport: {
        type: "streamable-http",
        endpoint: "/mcp"
      }
    });
  });

  /**
   * Health check endpoint
   */
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  const port = Number(process.env.PORT) || 8080;

  app.listen(port, () => {
    console.log(`Freshservice MCP server running on port ${port}`);
  });

}

start();