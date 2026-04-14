import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerPurchaseOrderTools(server: any) {

  server.tool(
    "list_purchase_orders",
    {
      page: z.number().optional(),
      per_page: z.number().max(100).optional()
    },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/purchase_orders", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_purchase_order",
    { purchase_order_id: z.number() },
    async ({ purchase_order_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/purchase_orders/${purchase_order_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_purchase_order",
    {
      vendor_id: z.number(),
      name: z.string(),
      po_number: z.string().optional(),
      vendor_details: z.string().optional(),
      expected_delivery_date: z.string().optional(),
      shipping_address: z.string().optional(),
      billing_same_as_shipping: z.boolean().optional(),
      billing_address: z.string().optional(),
      currency_code: z.string().optional(),
      conversion_rate: z.number().optional(),
      discount_percentage: z.number().optional(),
      tax_percentage: z.number().optional(),
      shipping_handling_charge: z.number().optional(),
      status: z.number().optional(),
      department_id: z.number().optional(),
      purchase_items: z.array(z.object({
        item_type: z.number().optional(),
        item_id: z.number().optional(),
        description: z.string().optional(),
        cost: z.number().optional(),
        quantity: z.number().optional(),
        tax_percentage: z.number().optional()
      })).optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/purchase_orders", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_purchase_order",
    {
      purchase_order_id: z.number(),
      vendor_id: z.number().optional(),
      name: z.string().optional(),
      po_number: z.string().optional(),
      expected_delivery_date: z.string().optional(),
      status: z.number().optional(),
      department_id: z.number().optional(),
      discount_percentage: z.number().optional(),
      tax_percentage: z.number().optional(),
      shipping_handling_charge: z.number().optional()
    },
    async ({ purchase_order_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/purchase_orders/${purchase_order_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_purchase_order",
    { purchase_order_id: z.number() },
    async ({ purchase_order_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/purchase_orders/${purchase_order_id}`);
        return mcpResponse({ success: true, message: `Purchase order ${purchase_order_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );

}
