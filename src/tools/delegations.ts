import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerDelegationTools(server: any) {

  server.tool(
    "create_delegation",
    {
      delegatee_id: z.number(),
      from_date: z.string(),
      to_date: z.string(),
      scope: z.string().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/delegations", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_delegation",
    { delegation_id: z.number() },
    async ({ delegation_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/delegations/${delegation_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_delegation",
    {
      delegation_id: z.number(),
      from_date: z.string().optional(),
      to_date: z.string().optional(),
      scope: z.string().optional()
    },
    async ({ delegation_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/delegations/${delegation_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_delegation",
    { delegation_id: z.number() },
    async ({ delegation_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/delegations/${delegation_id}`);
        return mcpResponse({ success: true, message: `Delegation ${delegation_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );

}
