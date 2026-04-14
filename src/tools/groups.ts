import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerGroupTools(server: any) {

  server.tool(
    "list_groups",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional(),
      workspace_id: z.number().optional()
    },
    async ({ page, per_page, workspace_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/groups", {
          params: { page, per_page, workspace_id }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_group",
    {
      group_id: z.number()
    },
    async ({ group_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/groups/${group_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_requester_groups",
    {
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/requester_groups", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_requester_group",
    {
      group_id: z.number()
    },
    async ({ group_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/requester_groups/${group_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_group",
    {
      name: z.string(),
      description: z.string().optional(),
      escalate_to: z.number().optional(),
      unassigned_for: z.string().optional(),
      agent_ids: z.array(z.number()).optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/groups", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_group",
    {
      group_id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      escalate_to: z.number().optional(),
      unassigned_for: z.string().optional(),
      agent_ids: z.array(z.number()).optional()
    },
    async ({ group_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/groups/${group_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_group",
    { group_id: z.number() },
    async ({ group_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/groups/${group_id}`);
        return mcpResponse({ success: true, message: `Group ${group_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_requester_group",
    { name: z.string(), description: z.string().optional() },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/requester_groups", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_requester_group",
    { group_id: z.number(), name: z.string().optional(), description: z.string().optional() },
    async ({ group_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/requester_groups/${group_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_requester_group",
    { group_id: z.number() },
    async ({ group_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/requester_groups/${group_id}`);
        return mcpResponse({ success: true, message: `Requester group ${group_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_requester_group_members",
    { group_id: z.number() },
    async ({ group_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/requester_groups/${group_id}/members`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "add_requester_group_member",
    { group_id: z.number(), requester_id: z.number() },
    async ({ group_id, requester_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(
          `/requester_groups/${group_id}/members`,
          { id: requester_id }
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "remove_requester_group_member",
    { group_id: z.number(), requester_id: z.number() },
    async ({ group_id, requester_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(
          `/requester_groups/${group_id}/members/${requester_id}`
        );
        return mcpResponse({ success: true, message: `Requester ${requester_id} removed from group.` });
      } catch (e) { return handleApiError(e); }
    }
  );

}
