import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerAlertTools(server: any) {

  server.tool(
    "list_alerts",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional(),
      status: z.string().optional()
    },
    async ({ page, per_page, status }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/alerts", {
          params: { page, per_page, status }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_alert",
    { alert_id: z.number() },
    async ({ alert_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/alerts/${alert_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "acknowledge_alert",
    { alert_id: z.number() },
    async ({ alert_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/alerts/${alert_id}/acknowledge`, {});
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "resolve_alert",
    { alert_id: z.number() },
    async ({ alert_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/alerts/${alert_id}/resolve`, {});
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "suppress_alert",
    { alert_id: z.number() },
    async ({ alert_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/alerts/${alert_id}/suppress`, {});
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "unsuppress_alert",
    { alert_id: z.number() },
    async ({ alert_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/alerts/${alert_id}/unsuppress`, {});
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_alert",
    { alert_id: z.number() },
    async ({ alert_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/alerts/${alert_id}`);
        return mcpResponse({ success: true, message: `Alert ${alert_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_alert_logs",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/alert_logs", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_alert_notes",
    { alert_id: z.number() },
    async ({ alert_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/alerts/${alert_id}/notes`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_alert_note",
    { alert_id: z.number(), body: z.string() },
    async ({ alert_id, body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(`/alerts/${alert_id}/notes`, { body });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
