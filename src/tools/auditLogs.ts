import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerAuditLogTools(server: any) {

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
        const res = await getClient(ctx.sessionId).post("/audit_logs/export", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
