import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerVendorTools(server: any) {

  server.tool(
    "list_vendors",
    {
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/vendors", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_vendor",
    {
      vendor_id: z.number()
    },
    async ({ vendor_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/vendors/${vendor_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_vendor",
    {
      name: z.string(),
      description: z.string().optional(),
      primary_contact_id: z.number().optional(),
      address: z.object({
        line1: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        zip_code: z.string().optional()
      }).optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/vendors", params);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_vendor",
    {
      vendor_id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      primary_contact_id: z.number().optional(),
      address: z.object({
        line1: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        zip_code: z.string().optional()
      }).optional()
    },
    async ({ vendor_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/vendors/${vendor_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}
