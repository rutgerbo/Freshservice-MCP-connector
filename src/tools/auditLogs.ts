import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerAuditLogTools(server: any) {

  server.tool(
    "list_audit_logs",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional(),
      since: z.string().optional(),
      before: z.string().optional(),
      actor_id: z.number().optional(),
      event_type: z.string().optional()
    },
    async ({ page, per_page, since, before, actor_id, event_type }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/audit_log", {
          params: { page, per_page, since, before, actor_id, event_type }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "export_audit_logs",
    {
      since: z.string().optional(),
      before: z.string().optional(),
      actor_id: z.number().optional(),
      actor_type: z.string().optional(),
      event_type: z.string().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/audit_log/export", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
