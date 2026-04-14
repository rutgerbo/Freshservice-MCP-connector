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


  server.tool(
    "restore_asset",
    { asset_id: z.number() },
    async ({ asset_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/assets/${asset_id}/restore`, {});
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "permanently_delete_asset",
    { asset_id: z.number() },
    async ({ asset_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/assets/${asset_id}/permanently_delete`);
        return mcpResponse({ success: true, message: `Asset ${asset_id} permanently deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "search_assets",
    {
      query: z.string(),
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ query, page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/assets", {
          params: { search: query, page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_asset_components",
    { asset_id: z.number() },
    async ({ asset_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/assets/${asset_id}/components`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_asset_requests",
    { asset_id: z.number() },
    async ({ asset_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/assets/${asset_id}/requests`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_asset_contracts",
    { asset_id: z.number() },
    async ({ asset_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/assets/${asset_id}/contracts`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_asset_relationships",
    { asset_id: z.number() },
    async ({ asset_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/assets/${asset_id}/relationships`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_asset_types",
    { page: z.number().optional(), per_page: z.number().optional() },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/asset_types", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_asset_type",
    { asset_type_id: z.number() },
    async ({ asset_type_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/asset_types/${asset_type_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_asset_type_fields",
    { asset_type_id: z.number() },
    async ({ asset_type_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/asset_types/${asset_type_id}/fields`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_relationship_types",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/relationship_types");
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
