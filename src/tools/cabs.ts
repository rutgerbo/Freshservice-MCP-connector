import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerCabTools(server: any) {

  server.tool(
    "list_cabs",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/cabs", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_cab",
    { cab_id: z.number() },
    async ({ cab_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/cabs/${cab_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_cab",
    {
      name: z.string(),
      description: z.string().optional(),
      approver_ids: z.array(z.number()).optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/cabs", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_cab",
    {
      cab_id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      approver_ids: z.array(z.number()).optional()
    },
    async ({ cab_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/cabs/${cab_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_cab",
    { cab_id: z.number() },
    async ({ cab_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/cabs/${cab_id}`);
        return mcpResponse({ success: true, message: `CAB ${cab_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );

}
