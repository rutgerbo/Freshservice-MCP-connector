import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";
import { handleApiError } from "../errors.js";

export function registerChangeTools(server: any) {

  server.tool(
    "list_changes",
    {
      page: z.number().optional(),
      per_page: z.number().optional(),
      order_type: z.enum(["asc", "desc"]).optional()
    },
    async ({ page, per_page, order_type }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/changes", {
          params: { page, per_page, order_type }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_all_changes",
    {},
    async (_: any, ctx: any) => {
      try {
        const changes = await fetchAllPages("/changes", {}, ctx.sessionId);
        return mcpResponse({ total: changes.length, changes });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_change",
    {
      change_id: z.number()
    },
    async ({ change_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/changes/${change_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_change",
    {
      subject: z.string(),
      description: z.string().optional(),
      email: z.string().optional(),
      requester_id: z.number().optional(),
      change_type: z.number().optional(),
      status: z.number().optional(),
      priority: z.number().optional(),
      impact: z.number().optional(),
      risk: z.number().optional(),
      group_id: z.number().optional(),
      agent_id: z.number().optional(),
      category: z.string().optional(),
      sub_category: z.string().optional(),
      item_category: z.string().optional(),
      department_id: z.number().optional(),
      planned_start_date: z.string().optional(),
      planned_end_date: z.string().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/changes", params);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_change",
    {
      change_id: z.number(),
      subject: z.string().optional(),
      description: z.string().optional(),
      change_type: z.number().optional(),
      status: z.number().optional(),
      priority: z.number().optional(),
      impact: z.number().optional(),
      risk: z.number().optional(),
      group_id: z.number().optional(),
      agent_id: z.number().optional(),
      category: z.string().optional(),
      sub_category: z.string().optional(),
      planned_start_date: z.string().optional(),
      planned_end_date: z.string().optional()
    },
    async ({ change_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/changes/${change_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "delete_change",
    {
      change_id: z.number()
    },
    async ({ change_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/changes/${change_id}`);
        return mcpResponse({ success: true, message: `Change ${change_id} deleted.` });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}
