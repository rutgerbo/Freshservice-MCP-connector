import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerWorkspaceTools(server: any) {

  server.tool(
    "list_workspaces",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/workspaces", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_workspace",
    { workspace_id: z.number() },
    async ({ workspace_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/workspaces/${workspace_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_workspace",
    {
      name: z.string(),
      description: z.string().optional(),
      primary_language: z.string().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/workspaces", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_workspace",
    {
      workspace_id: z.number(),
      name: z.string().optional(),
      description: z.string().optional()
    },
    async ({ workspace_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/workspaces/${workspace_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_workspace",
    { workspace_id: z.number() },
    async ({ workspace_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/workspaces/${workspace_id}`);
        return mcpResponse({ success: true, message: `Workspace ${workspace_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );

}
