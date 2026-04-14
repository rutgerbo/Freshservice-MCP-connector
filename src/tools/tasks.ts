import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

const parentTypeSchema = z.enum(["tickets", "problems", "changes", "releases"]);

export function registerTaskTools(server: any) {

  server.tool(
    "list_tasks",
    {
      parent_type: parentTypeSchema,
      parent_id: z.number(),
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ parent_type, parent_id, page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/${parent_type}/${parent_id}/tasks`, {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_task",
    {
      parent_type: parentTypeSchema,
      parent_id: z.number(),
      task_id: z.number()
    },
    async ({ parent_type, parent_id, task_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/${parent_type}/${parent_id}/tasks/${task_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_task",
    {
      parent_type: parentTypeSchema,
      parent_id: z.number(),
      title: z.string(),
      description: z.string().optional(),
      status: z.number().optional(),
      due_date: z.string().optional(),
      notify_before: z.number().optional(),
      agent_id: z.number().optional(),
      group_id: z.number().optional()
    },
    async ({ parent_type, parent_id, ...taskData }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(`/${parent_type}/${parent_id}/tasks`, taskData);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_task",
    {
      parent_type: parentTypeSchema,
      parent_id: z.number(),
      task_id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.number().optional(),
      due_date: z.string().optional(),
      notify_before: z.number().optional(),
      agent_id: z.number().optional(),
      group_id: z.number().optional()
    },
    async ({ parent_type, parent_id, task_id, ...taskData }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/${parent_type}/${parent_id}/tasks/${task_id}`, taskData);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "delete_task",
    {
      parent_type: parentTypeSchema,
      parent_id: z.number(),
      task_id: z.number()
    },
    async ({ parent_type, parent_id, task_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/${parent_type}/${parent_id}/tasks/${task_id}`);
        return mcpResponse({ success: true, message: `Task ${task_id} deleted.` });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}
