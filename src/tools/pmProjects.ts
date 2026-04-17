import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerPmProjectTools(server: any) {

  server.tool(
    "list_pm_projects",
    { page: z.number().optional(), per_page: z.number().max(100).optional() },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/pm/projects", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_pm_project",
    { project_id: z.number() },
    async ({ project_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/pm/projects/${project_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_pm_project",
    {
      name: z.string(),
      description: z.string().optional(),
      project_type: z.number().optional(),
      status: z.number().optional(),
      sprint_duration: z.number().optional(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
      manager_id: z.number().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/pm/projects", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_pm_project",
    {
      project_id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      status: z.number().optional(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
      manager_id: z.number().optional()
    },
    async ({ project_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/pm/projects/${project_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_pm_project",
    { project_id: z.number() },
    async ({ project_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/pm/projects/${project_id}`);
        return mcpResponse({ success: true, message: `PM project ${project_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_pm_project_tasks",
    { project_id: z.number(), page: z.number().optional(), per_page: z.number().optional() },
    async ({ project_id, page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/pm/projects/${project_id}/tasks`, {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_pm_project_task",
    { project_id: z.number(), task_id: z.number() },
    async ({ project_id, task_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/pm/projects/${project_id}/tasks/${task_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_pm_project_task",
    {
      project_id: z.number(),
      title: z.string(),
      description: z.string().optional(),
      status: z.number().optional(),
      priority: z.number().optional(),
      assignee_id: z.number().optional(),
      due_date: z.string().optional()
    },
    async ({ project_id, ...body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(`/pm/projects/${project_id}/tasks`, body);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_pm_project_task",
    {
      project_id: z.number(),
      task_id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.number().optional(),
      priority: z.number().optional(),
      assignee_id: z.number().optional(),
      due_date: z.string().optional()
    },
    async ({ project_id, task_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/pm/projects/${project_id}/tasks/${task_id}`,
          updates
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_pm_project_task",
    { project_id: z.number(), task_id: z.number() },
    async ({ project_id, task_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/pm/projects/${project_id}/tasks/${task_id}`);
        return mcpResponse({ success: true, message: `Task ${task_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_pm_project_members",
    { project_id: z.number() },
    async ({ project_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/pm/projects/${project_id}/members`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "add_pm_project_member",
    { project_id: z.number(), agent_id: z.number(), role: z.string().optional() },
    async ({ project_id, ...body }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(`/pm/projects/${project_id}/members`, body);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_pm_project_templates",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/pm/project_templates");
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_pm_project_sprints",
    { project_id: z.number() },
    async ({ project_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/pm/projects/${project_id}/sprints`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
