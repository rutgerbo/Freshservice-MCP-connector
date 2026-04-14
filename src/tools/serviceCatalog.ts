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
        // Freshservice wraps the response in a "service_item" key — unwrap it
        // so downstream callers receive the item object directly.
        const item = res.data?.service_item ?? res.data;
        return mcpResponse(item);
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
    "place_service_catalog_request",
    {
      display_id: z.number(),
      requested_for: z.string(),
      quantity: z.number().optional(),
      custom_fields: z.record(z.unknown()).optional()
    },
    async ({ display_id, requested_for, quantity = 1, custom_fields }: any, ctx: any) => {
      try {
        const body: Record<string, unknown> = { quantity, requested_for };
        if (custom_fields) body.custom_fields = custom_fields;
        const res = await getClient(ctx.sessionId).post(
          `/service_catalog/items/${display_id}/place_request`,
          body
        );
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
