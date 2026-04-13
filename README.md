# freshservice-mcp

A local MCP server for **Freshservice API v2**, intended for **Claude Desktop on Windows**.

This template uses:

- **TypeScript**
- **Node.js 20+**
- **STDIO transport** for Claude Desktop
- **Freshservice API key auth**

## What this server includes

This template exposes these MCP tools:

- `get_ticket`
- `list_tickets`
- `search_tickets`
- `create_ticket`
- `update_ticket`
- `get_requester`
- `get_agent`
- `list_changes`
- `raw_request`

`raw_request` is there so you can reach any `/api/v2/...` endpoint even before you add a dedicated tool for it.

---

## 1. Prerequisites

Install these on your Windows machine:

1. **Git for Windows**
2. **Node.js LTS** (20 or newer recommended)
3. **Claude Desktop**
4. A **Freshservice API key**
5. Your **Freshservice domain**, such as `companyname.freshservice.com`

Check Node after install:

```powershell
node --version
npm --version
```

---

## 2. Create a GitHub repository

Create a new GitHub repo, for example:

```text
freshservice-mcp
```

Then clone it locally:

```powershell
git clone https://github.com/YOUR_GITHUB_USERNAME/freshservice-mcp.git
cd freshservice-mcp
```

Copy the files from this template into that repo.

---

## 3. Install dependencies

From the project folder:

```powershell
npm install
```

---

## 4. Add your secrets locally

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and set:

```env
FRESHSERVICE_DOMAIN=yourcompany.freshservice.com
FRESHSERVICE_API_KEY=replace_with_your_api_key
```

Important:

- Do **not** commit `.env`
- Use the bare domain name, not a full URL
- The API key should belong to a service account or integration account if possible

---

## 5. Build the server

```powershell
npm run build
```

That creates the compiled code in `dist/`.

---

## 6. Test the server directly

You can test that it starts without Claude first:

```powershell
$env:FRESHSERVICE_DOMAIN="yourcompany.freshservice.com"
$env:FRESHSERVICE_API_KEY="your_api_key"
node .\dist\index.js
```

Expected result:

- The process starts
- It waits silently for MCP input
- You may see a startup line in stderr saying the server is running

To stop it:

```powershell
Ctrl+C
```

---

## 7. Configure Claude Desktop on Windows

Claude Desktop uses a config file at:

```text
%APPDATA%\Claude\claude_desktop_config.json
```

A typical Windows path is:

```text
C:\Users\YOUR_USERNAME\AppData\Roaming\Claude\claude_desktop_config.json
```

Open Claude Desktop:

1. Go to **Settings**
2. Open **Developer**
3. Choose **Edit Config**

Then put in a config like this. Replace the paths and values with your own:

```json
{
  "mcpServers": {
    "freshservice": {
      "command": "node",
      "args": [
        "C:\\Users\\YOUR_USERNAME\\source\\repos\\freshservice-mcp\\dist\\index.js"
      ],
      "env": {
        "FRESHSERVICE_DOMAIN": "yourcompany.freshservice.com",
        "FRESHSERVICE_API_KEY": "your_api_key"
      }
    }
  }
}
```

### Important Windows notes

- Use **absolute paths**
- Escape backslashes in JSON as `\\`
- Keep secrets in the `env` block or load them via a wrapper script
- After editing the config, fully restart Claude Desktop

---

## 8. Verify the server inside Claude Desktop

After restart:

1. Open a new Claude chat
2. Open the tools/connectors menu
3. Confirm `freshservice` appears
4. Ask Claude something like:

```text
Use Freshservice to get ticket 12345.
```

If Claude asks for approval, approve it.

---

## 9. First useful prompts to try

Try prompts like these in Claude Desktop:

```text
Use Freshservice to get ticket 12345.
```

```text
Use Freshservice to list my 10 most recently updated tickets.
```

```text
Use Freshservice to search tickets with query "status:2 AND priority:3".
```

```text
Use Freshservice to create a ticket for jane@example.com with subject "Laptop issue" and description "User cannot connect to VPN".
```

```text
Use Freshservice raw_request to GET /api/v2/problems?page=1&per_page=10.
```

---

## 10. Recommended development workflow

Use this method every time you extend the integration.

### Phase A — start with raw coverage

Use `raw_request` first so you can access any endpoint quickly.

Examples:

- `/api/v2/problems`
- `/api/v2/releases`
- `/api/v2/assets`
- `/api/v2/changes`
- `/api/v2/requesters`

### Phase B — inspect real responses

Use the raw endpoint against your own Freshservice instance and inspect:

- required fields
- optional fields
- enum values
- paging behavior
- error messages

### Phase C — add dedicated tools

When you know the real request and response shape, add a dedicated MCP tool for that endpoint.

Good candidates:

- `list_problems`
- `get_problem`
- `create_change`
- `list_assets`
- `get_release`

### Phase D — make tools safer

For write operations:

- narrow schemas
- validate inputs strictly
- keep descriptive tool names
- separate read tools from write tools

### Phase E — version and publish

After testing:

```powershell
git add .
git commit -m "Add Freshservice MCP server"
git push origin main
```

---

## 11. Recommended repo structure

```text
freshservice-mcp/
├─ src/
│  └─ index.ts
├─ dist/
├─ .env.example
├─ .gitignore
├─ package.json
├─ tsconfig.json
└─ README.md
```

As the server grows, split it like this:

```text
src/
├─ index.ts
├─ config.ts
├─ client/
│  └─ freshservice.ts
├─ tools/
│  ├─ tickets.ts
│  ├─ problems.ts
│  ├─ changes.ts
│  └─ assets.ts
└─ utils/
   └─ errors.ts
```

---

## 12. How authentication works

Freshservice API key auth is sent as **HTTP Basic Auth**:

- username = your API key
- password = `X`

This template creates the `Authorization: Basic ...` header automatically in code.

---

## 13. How to add a new endpoint

Example: add `list_problems`.

### Step 1
Check the endpoint in the Freshservice API docs.

### Step 2
Add a new tool registration in `src/index.ts`.

### Step 3
Use:

```ts
const result = await freshserviceRequest({
  path: "/api/v2/problems",
  query: { page, per_page }
});
```

### Step 4
Return the response through `textResult(result.data)`.

### Step 5
Rebuild:

```powershell
npm run build
```

### Step 6
Restart Claude Desktop.

---

## 14. Troubleshooting

### Claude Desktop does not show the server

Check:

- JSON syntax in `claude_desktop_config.json`
- absolute path to `dist/index.js`
- Node is installed and available in PATH
- you restarted Claude Desktop fully

### Server starts but tools fail

Check:

- correct Freshservice domain
- correct API key
- the API key has permission for the resource
- the endpoint exists in your Freshservice plan

### Claude says the server crashed

Most common reasons:

- missing environment variables
- wrong file path in config
- TypeScript not built yet
- logging accidentally sent to stdout instead of stderr

### I changed code but Claude still uses the old version

Run:

```powershell
npm run build
```

Then fully quit and reopen Claude Desktop.

---

## 15. Security recommendations

- Use a dedicated Freshservice API key for this integration
- Keep the account scope as narrow as practical
- Never commit `.env`
- Treat `raw_request` as a power tool
- Add more dedicated tools for common write operations instead of relying on generic writes forever

---

## 16. Suggested next improvements

1. Split tools into separate files
2. Add endpoint-specific tools for Problems, Releases, Assets, and Changes
3. Add stronger response shaping so Claude sees cleaner outputs
4. Add unit tests around request building and error handling
5. Add a GitHub Actions workflow for `npm ci` and `npm run check`

---

## 17. Minimal GitHub Actions example

Create `.github/workflows/ci.yml`:

```yaml
name: ci

on:
  push:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm run build
```

---

## 18. Publishing options

You have three good deployment options.

### Option 1 — Local only

Best for Claude Desktop on your Windows PC.

- keep repo in GitHub
- run the built server locally through Claude Desktop

### Option 2 — Private npm package

Good when multiple team members need the same server.

### Option 3 — Remote MCP later

If you later want centralized hosting, you can move from local stdio to a remote MCP transport. For Claude Desktop on Windows, local stdio is the simplest place to start.

---

## 19. Example Git commands

```powershell
git init
git add .
git commit -m "Initial Freshservice MCP server"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/freshservice-mcp.git
git push -u origin main
```

---

## 20. Final checklist

Before opening Claude Desktop, confirm all of these are true:

- `npm install` completed
- `npm run build` completed
- `dist/index.js` exists
- `claude_desktop_config.json` has the correct absolute path
- `FRESHSERVICE_DOMAIN` is correct
- `FRESHSERVICE_API_KEY` is correct
- Claude Desktop was restarted

