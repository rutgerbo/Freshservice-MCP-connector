import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";
import { handleApiError } from "../errors.js";

export function registerSoftwareTools(server: any) {

  server.tool(
    "list_software",
    {
      page: z.number().optional(),
      per_page: z.number().optional(),
      order_by: z.string().optional(),
      order_type: z.enum(["asc", "desc"]).optional()
    },
    async ({ page, per_page, order_by, order_type }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/softwares", {
          params: { page, per_page, order_by, order_type }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_all_software",
    {},
    async (_: any, ctx: any) => {
      try {
        const softwares = await fetchAllPages("/softwares", {}, ctx.sessionId);
        return mcpResponse({ total: softwares.length, softwares });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_software",
    {
      software_id: z.number()
    },
    async ({ software_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/softwares/${software_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_software_installations",
    {
      software_id: z.number(),
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ software_id, page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(
          `/softwares/${software_id}/installations`,
          { params: { page, per_page } }
        );
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_software",
    {
      name: z.string(),
      application_type: z.string().optional(),
      status: z.string().optional(),
      publisher_id: z.number().optional(),
      description: z.string().optional(),
      notes: z.string().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/softwares", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_software",
    {
      software_id: z.number(),
      name: z.string().optional(),
      application_type: z.string().optional(),
      status: z.string().optional(),
      description: z.string().optional(),
      notes: z.string().optional()
    },
    async ({ software_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/softwares/${software_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_software",
    { software_id: z.number() },
    async ({ software_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/softwares/${software_id}`);
        return mcpResponse({ success: true, message: `Software ${software_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_software_users",
    {
      software_id: z.number(),
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ software_id, page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/softwares/${software_id}/users`, {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_software_licenses",
    {
      software_id: z.number(),
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ software_id, page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/softwares/${software_id}/licenses`, {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
