import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";
import { handleApiError } from "../errors.js";

export function registerProblemTools(server: any) {

  server.tool(
    "list_problems",
    {
      page: z.number().optional(),
      per_page: z.number().optional(),
      order_type: z.enum(["asc", "desc"]).optional()
    },
    async ({ page, per_page, order_type }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/problems", {
          params: { page, per_page, order_type }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_all_problems",
    {},
    async (_: any, ctx: any) => {
      try {
        const problems = await fetchAllPages("/problems", {}, ctx.sessionId);
        return mcpResponse({ total: problems.length, problems });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_problem",
    {
      problem_id: z.number()
    },
    async ({ problem_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/problems/${problem_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_problem",
    {
      subject: z.string(),
      description: z.string().optional(),
      email: z.string().optional(),
      requester_id: z.number().optional(),
      status: z.number().optional(),
      priority: z.number().optional(),
      impact: z.number().optional(),
      group_id: z.number().optional(),
      agent_id: z.number().optional(),
      category: z.string().optional(),
      sub_category: z.string().optional(),
      item_category: z.string().optional(),
      department_id: z.number().optional(),
      due_by: z.string().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/problems", params);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_problem",
    {
      problem_id: z.number(),
      subject: z.string().optional(),
      description: z.string().optional(),
      status: z.number().optional(),
      priority: z.number().optional(),
      impact: z.number().optional(),
      group_id: z.number().optional(),
      agent_id: z.number().optional(),
      category: z.string().optional(),
      sub_category: z.string().optional(),
      item_category: z.string().optional(),
      due_by: z.string().optional()
    },
    async ({ problem_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/problems/${problem_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "delete_problem",
    {
      problem_id: z.number()
    },
    async ({ problem_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/problems/${problem_id}`);
        return mcpResponse({ success: true, message: `Problem ${problem_id} deleted.` });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_problem_notes",
    { problem_id: z.number(), page: z.number().optional(), per_page: z.number().optional() },
    async ({ problem_id, page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/problems/${problem_id}/notes`, {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_problem_note",
    { problem_id: z.number(), note_id: z.number() },
    async ({ problem_id, note_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/problems/${problem_id}/notes/${note_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_problem_note",
    {
      problem_id: z.number(),
      body: z.string(),
      notify_emails: z.array(z.string()).optional()
    },
    async ({ problem_id, ...body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(`/problems/${problem_id}/notes`, body);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_problem_note",
    { problem_id: z.number(), note_id: z.number(), body: z.string() },
    async ({ problem_id, note_id, body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/problems/${problem_id}/notes/${note_id}`,
          { body }
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_problem_note",
    { problem_id: z.number(), note_id: z.number() },
    async ({ problem_id, note_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/problems/${problem_id}/notes/${note_id}`);
        return mcpResponse({ success: true, message: `Note ${note_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "restore_problem",
    { problem_id: z.number() },
    async ({ problem_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/problems/${problem_id}/restore`, {});
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_problem_fields",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/problem_fields");
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "move_problem",
    { problem_id: z.number(), workspace_id: z.number() },
    async ({ problem_id, workspace_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/problems/${problem_id}/move_to_workspace`,
          { workspace_id }
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
