import "dotenv/config";
import express from "express";
import crypto from "crypto";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { registerTicketTools } from "./tools/tickets.js";
import { registerProblemTools } from "./tools/problems.js";
import { registerChangeTools } from "./tools/changes.js";
import { registerReleaseTools } from "./tools/releases.js";
import { registerAssetTools } from "./tools/assets.js";
import { registerSoftwareTools } from "./tools/software.js";
import { registerContractTools } from "./tools/contracts.js";
import { registerVendorTools } from "./tools/vendors.js";
import { registerProductTools } from "./tools/products.js";
import { registerServiceCatalogTools } from "./tools/serviceCatalog.js";
import { registerWorkflowTools } from "./tools/workflows.js";
import { registerRelationshipTools } from "./tools/relationships.js";
import { registerTaskTools } from "./tools/tasks.js";
import { registerTimeEntryTools } from "./tools/timeEntries.js";
import { registerSearchTools } from "./tools/search.js";
import { registerSyncTools } from "./tools/sync.js";
import { registerRequesterTools } from "./tools/requesters.js";
import { registerAgentTools } from "./tools/agents.js";
import { registerGroupTools } from "./tools/groups.js";
import { registerDepartmentTools } from "./tools/departments.js";
import { registerLocationTools } from "./tools/locations.js";
import { registerKnowledgeBaseTools } from "./tools/knowledgeBase.js";
import { registerAnnouncementTools } from "./tools/announcements.js";
import { registerProjectTools } from "./tools/projects.js";
import { registerSlaAndHoursTools } from "./tools/slaAndHours.js";
import { registerConfigureInstanceTool } from "./tools/configureInstance.js";

const app = express();

/*
CORS MUST be before all routes
*/
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  next();
});

/*
Preflight handlers
*/
app.options("/mcp", (_req, res) => res.sendStatus(200));
app.options("/.well-known/mcp", (_req, res) => res.sendStatus(200));

const server = new McpServer({
  name: "freshservice-mcp",
  version: "2.0.0"
});

// Core ITSM
registerTicketTools(server);
registerProblemTools(server);
registerChangeTools(server);
registerReleaseTools(server);

// Asset & Inventory
registerAssetTools(server);
registerSoftwareTools(server);
registerContractTools(server);
registerVendorTools(server);
registerProductTools(server);

// Service Catalog & Workflows
registerServiceCatalogTools(server);
registerWorkflowTools(server);
registerRelationshipTools(server);

// Sub-resources
registerTaskTools(server);
registerTimeEntryTools(server);

// People & Org
registerRequesterTools(server);
registerAgentTools(server);
registerGroupTools(server);
registerDepartmentTools(server);
registerLocationTools(server);

// Knowledge & Communication
registerKnowledgeBaseTools(server);
registerAnnouncementTools(server);

// Projects & System
registerProjectTools(server);
registerSlaAndHoursTools(server);

// Utilities
registerSearchTools(server);
registerSyncTools(server);
registerConfigureInstanceTool(server);

const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: () => crypto.randomUUID()
});

async function start() {

  await server.connect(transport);

  /*
  MCP endpoint MUST be first runtime route
  */
  app.all("/mcp", async (req, res) => {
    await transport.handleRequest(req, res);
  });

  /*
  Discovery endpoint
  */
  app.get("/.well-known/mcp", (_req, res) => {
    res.json({
      name: "freshservice-mcp",
      version: "2.0.0",
      capabilities: { tools: {} },
      transport: {
        type: "streamable-http",
        endpoint: "/mcp"
      }
    });
  });

  /*
  Health endpoint
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
