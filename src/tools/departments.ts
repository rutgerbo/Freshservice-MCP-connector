import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerDepartmentTools(server: any) {

  server.tool(
    "list_departments",
    {
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/departments", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_department",
    {
      department_id: z.number()
    },
    async ({ department_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/departments/${department_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_department",
    {
      name: z.string(),
      description: z.string().optional(),
      head_user_id: z.number().optional(),
      prime_user_id: z.number().optional(),
      domains: z.array(z.string()).optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/departments", params);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_department",
    {
      department_id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      head_user_id: z.number().optional(),
      prime_user_id: z.number().optional(),
      domains: z.array(z.string()).optional()
    },
    async ({ department_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/departments/${department_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}
