import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerProductTools(server: any) {

  server.tool(
    "list_products",
    {
      page: z.number().optional(),
      per_page: z.number().optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/products", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "get_product",
    {
      product_id: z.number()
    },
    async ({ product_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/products/${product_id}`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_product",
    {
      name: z.string(),
      asset_type_id: z.number().optional(),
      manufacturer: z.string().optional(),
      status: z.string().optional(),
      mode_of_procurement: z.string().optional(),
      depreciation_type_id: z.number().optional(),
      description: z.string().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/products", params);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_product",
    {
      product_id: z.number(),
      name: z.string().optional(),
      manufacturer: z.string().optional(),
      status: z.string().optional(),
      description: z.string().optional()
    },
    async ({ product_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/products/${product_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}
