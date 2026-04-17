import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerStatusPageTools(server: any) {

  server.tool(
    "list_status_page_incidents",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/status_pages/incidents", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_status_page_incident",
    { incident_id: z.number() },
    async ({ incident_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/status_pages/incidents/${incident_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_status_page_incident",
    {
      title: z.string(),
      status: z.number().optional(),
      message: z.string().optional(),
      component_ids: z.array(z.number()).optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/status_pages/incidents", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_status_page_incident",
    {
      incident_id: z.number(),
      title: z.string().optional(),
      status: z.number().optional(),
      message: z.string().optional()
    },
    async ({ incident_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/status_pages/incidents/${incident_id}`,
          updates
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_status_page_incident",
    { incident_id: z.number() },
    async ({ incident_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/status_pages/incidents/${incident_id}`);
        return mcpResponse({ success: true, message: `Status page incident ${incident_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_status_page_incident_update",
    {
      incident_id: z.number(),
      message: z.string(),
      status: z.number().optional()
    },
    async ({ incident_id, ...body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(
          `/status_pages/incidents/${incident_id}/updates`,
          body
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_status_page_maintenances",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/status_pages/maintenances", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_status_page_maintenance",
    {
      title: z.string(),
      message: z.string().optional(),
      scheduled_start_time: z.string().optional(),
      scheduled_end_time: z.string().optional(),
      component_ids: z.array(z.number()).optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/status_pages/maintenances", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_status_pages",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/status_pages");
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_status_page_service_components",
    { page: z.number().optional(), per_page: z.number().optional() },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/status_pages/service_components", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_status_page_incident_update",
    {
      incident_id: z.number(),
      update_id: z.number(),
      message: z.string().optional(),
      status: z.number().optional()
    },
    async ({ incident_id, update_id, ...body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/status_pages/incidents/${incident_id}/updates/${update_id}`,
          body
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_status_page_incident_update",
    { incident_id: z.number(), update_id: z.number() },
    async ({ incident_id, update_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(
          `/status_pages/incidents/${incident_id}/updates/${update_id}`
        );
        return mcpResponse({ success: true, message: `Incident update ${update_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_status_page_subscribers",
    { page: z.number().optional(), per_page: z.number().optional() },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/status_pages/subscribers", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_status_page_subscriber",
    { email: z.string(), component_ids: z.array(z.number()).optional() },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/status_pages/subscribers", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_status_page_subscriber",
    { subscriber_id: z.number() },
    async ({ subscriber_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/status_pages/subscribers/${subscriber_id}`);
        return mcpResponse({ success: true, message: `Subscriber ${subscriber_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );

}
