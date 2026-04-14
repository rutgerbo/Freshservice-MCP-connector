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

import {
  oauthMetadata,
  renderAuthorizeForm,
  processAuthorizeForm,
  processTokenRequest,
  extractBearerToken,
  getCredentialsForToken
} from "./oauth.js";

import { setSession } from "./sessionStore.js";

const app = express();

const BASE_URL =
  process.env.BASE_URL ||
  "https://freshservice-mcp-connector-production.up.railway.app";

/*
CORS — must be first
*/
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  next();
});

app.options("*", (_req, res) => res.sendStatus(200));

/*
Body parsers
*/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*
OAuth 2.0 — required for Claude Web remote MCP connections
*/
app.get("/.well-known/oauth-authorization-server", (_req, res) => {
  res.json(oauthMetadata(BASE_URL));
});

app.get("/oauth/authorize", (req, res) => {
  res.send(renderAuthorizeForm(req.query as Record<string, string>));
});

app.post("/oauth/authorize", (req, res) => {
  const result = processAuthorizeForm(req.body);
  if ("error" in result) {
    res.status(result.status).send(result.error);
    return;
  }
  res.redirect(result.redirectUrl);
});

app.post("/oauth/token", (req, res) => {
  const result = processTokenRequest(req.body);
  if ("error" in result) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.json(result.token);
});

/*
Per-session MCP transport store
*/
const sessions = new Map<string, StreamableHTTPServerTransport>();

function createMcpServer(): McpServer {
  const server = new McpServer({ name: "freshservice-mcp", version: "2.0.0" });

  registerTicketTools(server);
  registerProblemTools(server);
  registerChangeTools(server);
  registerReleaseTools(server);
  registerAssetTools(server);
  registerSoftwareTools(server);
  registerContractTools(server);
  registerVendorTools(server);
  registerProductTools(server);
  registerServiceCatalogTools(server);
  registerWorkflowTools(server);
  registerRelationshipTools(server);
  registerTaskTools(server);
  registerTimeEntryTools(server);
  registerRequesterTools(server);
  registerAgentTools(server);
  registerGroupTools(server);
  registerDepartmentTools(server);
  registerLocationTools(server);
  registerKnowledgeBaseTools(server);
  registerAnnouncementTools(server);
  registerProjectTools(server);
  registerSlaAndHoursTools(server);
  registerSearchTools(server);
  registerSyncTools(server);
  registerConfigureInstanceTool(server);

  return server;
}

/*
MCP endpoint
*/
app.post("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  if (sessionId && sessions.has(sessionId)) {
    await sessions.get(sessionId)!.handleRequest(req, res, req.body);
    return;
  }

  // New session
  const bearerToken = extractBearerToken(req.headers.authorization);

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
    onsessioninitialized: (newSessionId) => {
      sessions.set(newSessionId, transport);

      // Pre-load Freshservice credentials from OAuth token so tools work
      // without needing a separate configure_freshservice_instance call
      if (bearerToken) {
        const creds = getCredentialsForToken(bearerToken);
        if (creds) {
          setSession(newSessionId, creds);
        }
      }
    }
  });

  transport.onclose = () => {
    if (transport.sessionId) sessions.delete(transport.sessionId);
  };

  const server = createMcpServer();
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

// GET /mcp — SSE stream for an existing session, or 405 if no session
app.get("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !sessions.has(sessionId)) {
    res.status(405).json({ error: "Use POST /mcp to start a session." });
    return;
  }
  await sessions.get(sessionId)!.handleRequest(req, res);
});

// DELETE /mcp — explicit session termination
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
