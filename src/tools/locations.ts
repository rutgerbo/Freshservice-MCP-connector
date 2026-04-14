import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerLocationTools(server: any) {

  server.tool(
    "list_locations",
    {
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/locations", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_location",
    {
      location_id: z.number()
    },
    async ({ location_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/locations/${location_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_location",
    {
      name: z.string(),
      parent_location_id: z.number().optional(),
      primary_contact_id: z.number().optional(),
      address: z.object({
        line1: z.string().optional(),
        line2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        zip_code: z.string().optional()
      }).optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/locations", params);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_location",
    {
      location_id: z.number(),
      name: z.string().optional(),
      parent_location_id: z.number().optional(),
      primary_contact_id: z.number().optional(),
      address: z.object({
        line1: z.string().optional(),
        line2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        zip_code: z.string().optional()
      }).optional()
    },
    async ({ location_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/locations/${location_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "delete_location",
    { location_id: z.number() },
    async ({ location_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/locations/${location_id}`);
        return mcpResponse({ success: true, message: `Location ${location_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );

}
