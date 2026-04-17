import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerPhysicalSubtypeTools(server: any) {

  server.tool(
    "list_physical_asset_subtypes",
    { page: z.number().optional(), per_page: z.number().optional() },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/physical_asset_subtypes", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_physical_asset_subtype",
    { subtype_id: z.number() },
    async ({ subtype_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/physical_asset_subtypes/${subtype_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_physical_asset_subtype",
    {
      name: z.string(),
      description: z.string().optional(),
      asset_type_id: z.number().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/physical_asset_subtypes", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_physical_asset_subtype",
    {
      subtype_id: z.number(),
      name: z.string().optional(),
      description: z.string().optional()
    },
    async ({ subtype_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/physical_asset_subtypes/${subtype_id}`,
          updates
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_physical_asset_subtype",
    { subtype_id: z.number() },
    async ({ subtype_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/physical_asset_subtypes/${subtype_id}`);
        return mcpResponse({ success: true, message: `Physical asset subtype ${subtype_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );

}
