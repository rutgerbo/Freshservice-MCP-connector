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
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  next();
});

/*
Preflight handlers
*/
app.options("/mcp", (_req, res) => res.sendStatus(200));
app.options("/.well-known/mcp", (_req, res) => res.sendStatus(200));

/*
Parse JSON bodies — required for MCP initialize handshake
*/
app.use(express.json());

/*
Per-session transport store: each Claude Web session gets its own
McpServer + StreamableHTTPServerTransport so the "already initialized"
error cannot occur.
*/
const sessions = new Map<string, StreamableHTTPServerTransport>();

function createMcpServer(): McpServer {
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

  return server;
}

/*
MCP endpoint — handles POST (JSON-RPC), GET (SSE stream), DELETE (session close)
*/
app.post("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  if (sessionId && sessions.has(sessionId)) {
    const transport = sessions.get(sessionId)!;
    await transport.handleRequest(req, res, req.body);
    return;
  }

  // New session: create a dedicated transport + server pair
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
    onsessioninitialized: (newSessionId) => {
      sessions.set(newSessionId, transport);
    }
  });

  transport.onclose = () => {
    if (transport.sessionId) {
      sessions.delete(transport.sessionId);
    }
  };

  const server = createMcpServer();
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.get("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !sessions.has(sessionId)) {
    res.status(400).json({ error: "Session not found. Start with POST /mcp." });
    return;
  }
  await sessions.get(sessionId)!.handleRequest(req, res);
});

app.delete("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !sessions.has(sessionId)) {
    res.status(400).json({ error: "Session not found." });
    return;
  }
  await sessions.get(sessionId)!.handleRequest(req, res);
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
  res.json({ status: "ok", sessions: sessions.size });
});

const port = Number(process.env.PORT) || 8080;

app.listen(port, () => {
  console.log(`Freshservice MCP server running on port ${port}`);
});
