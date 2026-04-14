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

}
