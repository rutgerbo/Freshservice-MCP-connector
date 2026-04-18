# Freshservice MCP Connector

A **remote MCP server** exposing the full **Freshservice API v2** as Claude tools, deployed on **Railway** and compatible with **Claude.ai**, **Claude Desktop**, and any MCP-capable client.

---

## What it is

This connector wraps the Freshservice v2 REST API as ~300 MCP tools across every major Freshservice domain: tickets, problems, changes, releases, assets, software, contracts, service catalog, knowledge base, agents, requesters, groups, departments, locations, projects, on-call, status pages, approvals, and more.

Authentication is **per-session** — each Claude chat configures its own Freshservice tenant by calling `configure_freshservice_instance`. No shared credentials, no `.env` file needed.

---

## Transport

**Streamable HTTP** (`/mcp` endpoint). This is a remote MCP server — not a local STDIO process. It runs continuously on Railway and is accessed over HTTPS.

---

## Connecting from Claude Desktop

Add this to `claude_desktop_config.json`
(`%APPDATA%\Claude\claude_desktop_config.json` on Windows, `~/Library/Application Support/Claude/claude_desktop_config.json` on Mac):

```json
{
  "mcpServers": {
    "freshservice": {
      "type": "http",
      "url": "https://freshservice-mcp-connector-production.up.railway.app/mcp"
    }
  }
}
```

Fully restart Claude Desktop after saving. The connector will appear in the tools menu on next launch.

Then in Claude, run `configure_freshservice_instance` once per session.

---

## Connecting from Claude Web (claude.ai)

1. Go to [claude.ai](https://claude.ai) and sign in
2. Click your **profile icon** (bottom-left) → **Settings**
3. Open the **Integrations** tab
4. Click **Add integration**
5. Enter a name (e.g. `Freshservice`) and the server URL:
   ```
   https://freshservice-mcp-connector-production.up.railway.app/mcp
   ```
6. Click **Add** — the integration will appear in your list

### Enabling the connector in a chat

The integration is not active by default in every conversation. To use it:

1. Open a new chat
2. Click the **tools icon** (the plug/connector icon in the message bar)
3. Toggle **Freshservice** on
4. Claude will now have access to all Freshservice tools in that conversation

### Configuring permissions

When a tool is called for the first time, Claude Web will prompt you to **allow or deny** it. You can set a standing permission so you are not asked every time:

1. When the permission prompt appears, check **"Always allow"** to approve that tool for all future calls in this session
2. To manage permissions across sessions, go to **Settings → Integrations → Freshservice → Manage permissions**
3. From there you can:
   - Allow all tools from this connector without prompting
   - Block specific tools (e.g. delete operations) while allowing read tools
   - Reset all permissions back to ask-every-time

> **Tip:** It is recommended to allow read tools freely but keep a prompt on write/delete tools (`delete_ticket`, `delete_asset`, `permanently_delete_*`, etc.) so you stay in control of destructive operations.

---

## Authentication

Credentials are **not stored server-side** between sessions. Call `configure_freshservice_instance` at the start of each session:

| Parameter | Required | Description |
|---|---|---|
| `domain` | Yes | e.g. `yourcompany.freshservice.com` |
| `api_key` | Yes | Freshservice API key (Basic Auth, password = `X`) |
| `workspace_id` | No | Default: `2` (IT workspace). Needed for Solutions API. |

---

## Tool coverage

| Area | Tools |
|---|---|
| Tickets | list, get, create, update, delete, restore, conversations, approvals, CSAT, child tickets, major incident |
| Problems | list, get, create, update, delete, restore, notes |
| Changes | list, get, create, update, delete, notes, approvals |
| Releases | list, get, create, update, delete, restore, notes |
| Assets | list, get, create, update, delete, restore, components, types, relationships, history |
| Software | list, get, create, update, delete, users, licenses, installations |
| Contracts | list, get, create, update, delete, approval workflow, assets, types |
| Service Catalog | list/search items, place requests, CRUD items, shared fields |
| Knowledge Base | categories, folders, articles — full CRUD with workspace scoping |
| Agents & Requesters | full CRUD, field definitions, convert, forget |
| Groups & Departments | agent groups, requester groups, member management |
| Projects (ITSM) | list, get, create, update, delete, members |
| Projects (PM/NewGen) | full CRUD, tasks, members, templates, sprints |
| On-call | schedules, shifts, overrides, escalation policies |
| Status Pages | incidents, maintenance, subscribers, service components |
| Approvals | global list, approval groups CRUD, service request approvals |
| Misc | audit logs, workspaces, announcements, SLA, CAB, journeys, delegations, onboarding, alerts, canned responses, post-incident reports, custom objects, purchase orders, vendors, products |

---

## Running locally

```bash
git clone https://github.com/rutgerbo/Freshservice-MCP-connector.git
cd Freshservice-MCP-connector
npm install
npm run build
PORT=8080 node dist/index.js
```

The server listens on `http://localhost:8080/mcp`.

---

## Deploying to Railway

The repo is configured for Railway auto-deploy on push to `main`. No environment variables required — all credentials are passed per-session via `configure_freshservice_instance`.

Health check: `GET /health`
Discovery: `GET /.well-known/mcp`

---

## Project structure

```
src/
├─ index.ts                  # Express server, session management, tool registration
├─ freshserviceClient.ts     # Axios client factory + getWorkspaceId helper
├─ sessionStore.ts           # In-memory per-session credential store
├─ pagination.ts             # fetchAllPages helper
├─ response.ts               # mcpResponse serializer
├─ errors.ts                 # handleApiError with safe JSON serialization
└─ tools/
   ├─ tickets.ts
   ├─ problems.ts
   ├─ changes.ts
   ├─ releases.ts
   ├─ assets.ts
   ├─ software.ts
   ├─ contracts.ts
   ├─ serviceCatalog.ts
   ├─ knowledgeBase.ts
   ├─ agents.ts
   ├─ requesters.ts
   ├─ groups.ts
   ├─ departments.ts
   ├─ locations.ts
   ├─ projects.ts
   ├─ pmProjects.ts
   ├─ approvals.ts
   ├─ collaborate.ts
   ├─ oncall.ts
   ├─ statusPage.ts
   └─ ... (30+ tool files)
```

---

## Security notes

- API keys are held **in memory only** for the duration of the session and never persisted or logged
- Each Railway instance is single-tenant per deployment; session state is not shared across processes
- Use a dedicated Freshservice API key with the minimum required permissions
- CORS is open (`*`) since the server is intended for use with Claude clients — restrict if needed
