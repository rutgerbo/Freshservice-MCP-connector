import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { fetchAllPages } from "../pagination.js";
import { handleApiError } from "../errors.js";

export function registerServiceCatalogTools(server: any) {

  server.tool(
    "list_service_catalog_items",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/service_catalog/items", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_all_service_catalog_items",
    {},
    async (_: any, ctx: any) => {
      try {
        const items = await fetchAllPages("/service_catalog/items", {}, ctx.sessionId);
        return mcpResponse({ total: items.length, service_items: items });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_service_catalog_item",
    {
      item_id: z.number()
    },
    async ({ item_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/service_catalog/items/${item_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "list_service_categories",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/service_catalog/categories", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_service_request",
    {
      request_id: z.number()
    },
    async ({ request_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/service_requests/${request_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}
