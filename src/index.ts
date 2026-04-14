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
import { registerPurchaseOrderTools } from "./tools/purchaseOrders.js";
import { registerCustomObjectTools } from "./tools/customObjects.js";
import { registerOnboardingTools } from "./tools/onboarding.js";
import { registerAlertTools } from "./tools/alerts.js";
import { registerCabTools } from "./tools/cabs.js";
import { registerStatusPageTools } from "./tools/statusPage.js";
import { registerOncallTools } from "./tools/oncall.js";
import { registerCannedResponseTools } from "./tools/cannedResponses.js";
import { registerAuditLogTools } from "./tools/auditLogs.js";
import { registerWorkspaceTools } from "./tools/workspaces.js";
import { registerPostIncidentReportTools } from "./tools/postIncidentReports.js";
import { registerJourneyTools } from "./tools/journeys.js";
import { registerDelegationTools } from "./tools/delegations.js";

const app = express();

/*
CORS — must be before all routes. OPTIONS is handled here directly
so we never need a wildcard route (Express v5 / path-to-regexp v8
does not accept bare "*").
*/
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

/*
Body parsing
*/
app.use(express.json());

/*
Per-session MCP transport store — each Claude chat session gets its own
McpServer + StreamableHTTPServerTransport. Authentication is done inside
the session by calling configure_freshservice_instance.
*/
const sessions = new Map<string, StreamableHTTPServerTransport>();

function createMcpServer(): McpServer {
  const server = new McpServer({ name: "freshservice-mcp", version: "2.0.0" });

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

  // Finance & Procurement
  registerPurchaseOrderTools(server);

  // Custom Data
  registerCustomObjectTools(server);

  // HR Workflows
  registerOnboardingTools(server);
  registerJourneyTools(server);
  registerDelegationTools(server);

  // Monitoring & Ops
  registerAlertTools(server);
  registerStatusPageTools(server);
  registerOncallTools(server);
  registerPostIncidentReportTools(server);
  registerCabTools(server);

  // Admin & Config
  registerCannedResponseTools(server);
  registerAuditLogTools(server);
  registerWorkspaceTools(server);

  return server;
}

/*
MCP endpoint — POST to send messages, GET to open SSE stream, DELETE to close session
*/
app.post("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  if (sessionId && sessions.has(sessionId)) {
    await sessions.get(sessionId)!.handleRequest(req, res, req.body);
    return;
  }

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
    onsessioninitialized: (newSessionId) => {
      sessions.set(newSessionId, transport);
    }
  });

  transport.onclose = () => {
    if (transport.sessionId) sessions.delete(transport.sessionId);
  };

  const server = createMcpServer();
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.get("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !sessions.has(sessionId)) {
    res.status(405).json({ error: "Use POST /mcp to start a session." });
    return;
  }
  await sessions.get(sessionId)!.handleRequest(req, res);
});

app.delete("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !sessions.has(sessionId)) {
    res.status(404).json({ error: "Session not found." });
    return;
  }
  await sessions.get(sessionId)!.handleRequest(req, res);
});

/*
Discovery + health
*/
app.get("/.well-known/mcp", (_req, res) => {
  res.json({
    name: "freshservice-mcp",
    version: "2.0.0",
    capabilities: { tools: {} },
    transport: { type: "streamable-http", endpoint: "/mcp" }
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", sessions: sessions.size });
});

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`Freshservice MCP server running on port ${port}`);
});
