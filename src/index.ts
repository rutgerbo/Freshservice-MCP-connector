import "dotenv/config";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
#import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

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
import { HttpServerTransport } from "@modelcontextprotocol/sdk/server/http.js";

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

#async function main() {
#  const transport = new StdioServerTransport();
#  await server.connect(transport);
#}

const transport = new HttpServerTransport({
  port: process.env.PORT || 3000,
  endpoint: "/mcp"
});

await server.connect(transport);

main();