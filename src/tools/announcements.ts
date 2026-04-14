import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerAnnouncementTools(server: any) {

  server.tool(
    "list_announcements",
    {
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/announcements", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_announcement",
    {
      announcement_id: z.number()
    },
    async ({ announcement_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/announcements/${announcement_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_announcement",
    {
      title: z.string(),
      body_html: z.string(),
      visible_from: z.string().optional(),
      visible_till: z.string().optional(),
      is_read: z.boolean().optional(),
      send_email: z.boolean().optional(),
      additional_emails: z.array(z.string()).optional(),
      group_ids: z.array(z.number()).optional(),
      department_ids: z.array(z.number()).optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/announcements", params);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_announcement",
    {
      announcement_id: z.number(),
      title: z.string().optional(),
      body_html: z.string().optional(),
      visible_from: z.string().optional(),
      visible_till: z.string().optional(),
      send_email: z.boolean().optional(),
      additional_emails: z.array(z.string()).optional(),
      group_ids: z.array(z.number()).optional(),
      department_ids: z.array(z.number()).optional()
    },
    async ({ announcement_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/announcements/${announcement_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "delete_announcement",
    {
      announcement_id: z.number()
    },
    async ({ announcement_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/announcements/${announcement_id}`);
        return mcpResponse({ success: true, message: `Announcement ${announcement_id} deleted.` });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}
