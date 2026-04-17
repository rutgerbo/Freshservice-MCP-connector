import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerDeviceTools(server: any) {

  server.tool(
    "list_devices",
    { page: z.number().optional(), per_page: z.number().max(100).optional() },
    async ({ page, per_page }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/devices", {
          params: { page, per_page }
        });
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_device",
    { device_id: z.number() },
    async ({ device_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/devices/${device_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_device",
    {
      name: z.string(),
      device_type: z.string().optional(),
      serial_number: z.string().optional(),
      asset_id: z.number().optional(),
      user_id: z.number().optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/devices", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_device",
    {
      device_id: z.number(),
      name: z.string().optional(),
      serial_number: z.string().optional(),
      user_id: z.number().optional()
    },
    async ({ device_id, ...updates }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(`/devices/${device_id}`, updates);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_device",
    { device_id: z.number() },
    async ({ device_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/devices/${device_id}`);
        return mcpResponse({ success: true, message: `Device ${device_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );

}
