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
app.use(express.raw({ type: "*/*" }));

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

const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: undefined
});

async function start() {

  await server.connect(transport);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/mcp", async (req, res) => {
    await transport.handleRequest(req, res, req.body);
  });

  app.get("/mcp", (_req, res) => {
    res.status(405).send("Method Not Allowed");
  });

  const port = Number(process.env.PORT) || 3000;

  app.listen(port, () => {
    console.log(`Freshservice MCP server running on port ${port}`);
  });

}

start();
