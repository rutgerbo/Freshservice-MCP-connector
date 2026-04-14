import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";
import { handleApiError } from "../errors.js";

export function registerAssetTools(server: any) {

  server.tool(
    "list_assets",
    {
      page: z.number().optional(),
      per_page: z.number().optional(),
      order_by: z.string().optional(),
      order_type: z.enum(["asc", "desc"]).optional()
    },
    async ({ page, per_page, order_by, order_type }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/assets", {
          params: { page, per_page, order_by, order_type }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_all_assets",
    {},
    async (_: any, ctx: any) => {
      try {
        const assets = await fetchAllPages("/assets", {}, ctx.sessionId);
        return mcpResponse({ total: assets.length, assets });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_asset",
    {
      asset_id: z.number()
    },
    async ({ asset_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/assets/${asset_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_asset",
    {
      name: z.string(),
      asset_type_id: z.number(),
      asset_tag: z.string().optional(),
      description: z.string().optional(),
      location_id: z.number().optional(),
      department_id: z.number().optional(),
      agent_id: z.number().optional(),
      group_id: z.number().optional(),
      assigned_on: z.string().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/assets", params);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_asset",
    {
      asset_id: z.number(),
      name: z.string().optional(),
      asset_tag: z.string().optional(),
      description: z.string().optional(),
      location_id: z.number().optional(),
      department_id: z.number().optional(),
      agent_id: z.number().optional(),
      group_id: z.number().optional()
    },
    async ({ asset_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/assets/${asset_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "delete_asset",
    {
      asset_id: z.number()
    },
    async ({ asset_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/assets/${asset_id}`);
        return mcpResponse({ success: true, message: `Asset ${asset_id} deleted.` });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}
