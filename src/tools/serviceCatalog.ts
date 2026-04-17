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
        const body: Record<string, unknown> = { quantity, email: requested_for };
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
    "search_service_catalog_items",
    {
      query: z.string(),
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ query, page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/service_catalog/items", {
          params: { search: query, page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_service_catalog_item",
    {
      name: z.string(),
      category_id: z.number(),
      description: z.string().optional(),
      short_description: z.string().optional(),
      display_order: z.number().optional(),
      visible_in_portal: z.boolean().optional(),
      cost_visibility: z.boolean().optional(),
      delivery_time: z.number().optional(),
      allow_attachments: z.boolean().optional(),
      allow_quantity: z.boolean().optional(),
      custom_fields: z.record(z.unknown()).optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/service_catalog_items", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_service_catalog_item",
    {
      item_id: z.number(),
      name: z.string().optional(),
      category_id: z.number().optional(),
      description: z.string().optional(),
      short_description: z.string().optional(),
      display_order: z.number().optional(),
      visible_in_portal: z.boolean().optional(),
      cost_visibility: z.boolean().optional(),
      delivery_time: z.number().optional(),
      allow_attachments: z.boolean().optional(),
      allow_quantity: z.boolean().optional(),
      custom_fields: z.record(z.unknown()).optional()
    },
    async ({ item_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/service_catalog_items/${item_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_service_catalog_item",
    { item_id: z.number() },
    async ({ item_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/service_catalog_items/${item_id}`);
        return mcpResponse({ success: true, message: `Service catalog item ${item_id} deleted.` });
      } catch (e) { return handleApiError(e); }
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


  server.tool(
    "list_service_catalog_shared_fields",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/service_catalog_shared_fields");
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_service_catalog_shared_field",
    { field_id: z.number() },
    async ({ field_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/service_catalog_shared_fields/${field_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_service_catalog_shared_field",
    {
      label: z.string(),
      field_type: z.string(),
      description: z.string().optional(),
      required: z.boolean().optional(),
      choices: z.array(z.string()).optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/service_catalog_shared_fields", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_service_catalog_shared_field",
    {
      field_id: z.number(),
      label: z.string().optional(),
      description: z.string().optional(),
      required: z.boolean().optional(),
      choices: z.array(z.string()).optional()
    },
    async ({ field_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/service_catalog_shared_fields/${field_id}`,
          updates
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_service_catalog_shared_field",
    { field_id: z.number() },
    async ({ field_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/service_catalog_shared_fields/${field_id}`);
        return mcpResponse({ success: true, message: `Shared field ${field_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "archive_service_catalog_shared_field",
    { field_id: z.number() },
    async ({ field_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/service_catalog_shared_fields/${field_id}/archive`,
          {}
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "unarchive_service_catalog_shared_field",
    { field_id: z.number() },
    async ({ field_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/service_catalog_shared_fields/${field_id}/unarchive`,
          {}
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
