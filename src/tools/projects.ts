import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerProjectTools(server: any) {

  server.tool(
    "list_projects",
    {
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/projects", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_project",
    {
      project_id: z.number()
    },
    async ({ project_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/projects/${project_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_project",
    {
      name: z.string(),
      description: z.string().optional(),
      status: z.number().optional(),
      project_type: z.number().optional(),
      manager_id: z.number().optional(),
      start_date: z.string().optional(),
      end_date: z.string().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/projects", params);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_project",
    {
      project_id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      status: z.number().optional(),
      manager_id: z.number().optional(),
      start_date: z.string().optional(),
      end_date: z.string().optional()
    },
    async ({ project_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/projects/${project_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_project_tasks",
    {
      project_id: z.number(),
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ project_id, page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/projects/${project_id}/tasks`, {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}
