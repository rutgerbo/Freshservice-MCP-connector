import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";
import { handleApiError } from "../errors.js";

export function registerAgentTools(server: any) {

  server.tool(
    "list_agents",
    {
      page: z.number().optional(),
      per_page: z.number().optional(),
      email: z.string().optional(),
      active: z.boolean().optional()
    },
    async ({ page, per_page, email, active }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/agents", {
          params: { page, per_page, email, active }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_all_agents",
    {
      active: z.boolean().optional()
    },
    async ({ active }: any, ctx: any) => {
      try {
        const agents = await fetchAllPages("/agents", active !== undefined ? { active } : {}, ctx.sessionId);
        return mcpResponse({ total: agents.length, agents });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_agent",
    {
      agent_id: z.number()
    },
    async ({ agent_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/agents/${agent_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_current_agent",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/agents/me");
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}
