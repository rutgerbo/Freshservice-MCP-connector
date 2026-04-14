import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";
import { handleApiError } from "../errors.js";

export function registerReleaseTools(server: any) {

  server.tool(
    "list_releases",
    {
      page: z.number().optional(),
      per_page: z.number().optional(),
      order_type: z.enum(["asc", "desc"]).optional()
    },
    async ({ page, per_page, order_type }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/releases", {
          params: { page, per_page, order_type }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_all_releases",
    {},
    async (_: any, ctx: any) => {
      try {
        const releases = await fetchAllPages("/releases", {}, ctx.sessionId);
        return mcpResponse({ total: releases.length, releases });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_release",
    {
      release_id: z.number()
    },
    async ({ release_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/releases/${release_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_release",
    {
      subject: z.string(),
      description: z.string().optional(),
      release_type: z.number().optional(),
      status: z.number().optional(),
      priority: z.number().optional(),
      planned_start_date: z.string().optional(),
      planned_end_date: z.string().optional(),
      work_start_date: z.string().optional(),
      work_end_date: z.string().optional(),
      group_id: z.number().optional(),
      agent_id: z.number().optional(),
      category: z.string().optional(),
      sub_category: z.string().optional(),
      department_id: z.number().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/releases", params);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_release",
    {
      release_id: z.number(),
      subject: z.string().optional(),
      description: z.string().optional(),
      release_type: z.number().optional(),
      status: z.number().optional(),
      priority: z.number().optional(),
      planned_start_date: z.string().optional(),
      planned_end_date: z.string().optional(),
      work_start_date: z.string().optional(),
      work_end_date: z.string().optional(),
      group_id: z.number().optional(),
      agent_id: z.number().optional(),
      category: z.string().optional(),
      sub_category: z.string().optional()
    },
    async ({ release_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/releases/${release_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "delete_release",
    {
      release_id: z.number()
    },
    async ({ release_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/releases/${release_id}`);
        return mcpResponse({ success: true, message: `Release ${release_id} deleted.` });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "restore_release",
    { release_id: z.number() },
    async ({ release_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/releases/${release_id}/restore`, {});
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_release_notes",
    { release_id: z.number(), page: z.number().optional(), per_page: z.number().optional() },
    async ({ release_id, page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/releases/${release_id}/notes`, {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_release_note",
    { release_id: z.number(), body: z.string(), notify_emails: z.array(z.string()).optional() },
    async ({ release_id, ...body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(`/releases/${release_id}/notes`, body);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_release_note",
    { release_id: z.number(), note_id: z.number(), body: z.string() },
    async ({ release_id, note_id, body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/releases/${release_id}/notes/${note_id}`,
          { body }
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_release_note",
    { release_id: z.number(), note_id: z.number() },
    async ({ release_id, note_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/releases/${release_id}/notes/${note_id}`);
        return mcpResponse({ success: true, message: `Note ${note_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );

}
