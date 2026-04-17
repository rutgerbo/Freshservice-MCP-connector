import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerCloudResourceTools(server: any) {

  server.tool(
    "list_cloud_resources",
    { page: z.number().optional(), per_page: z.number().max(100).optional() },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/cloud_resources", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_cloud_resource",
    { resource_id: z.number() },
    async ({ resource_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/cloud_resources/${resource_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_cloud_infrastructure",
    { page: z.number().optional(), per_page: z.number().max(100).optional() },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/cloud_infrastructure", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_asset_lifecycle_events",
    { asset_id: z.number() },
    async ({ asset_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/assets/${asset_id}/lifecycle_events`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
