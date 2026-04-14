import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerCustomObjectTools(server: any) {

  server.tool(
    "list_custom_objects",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/custom_objects");
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_custom_object",
    { custom_object_id: z.number() },
    async ({ custom_object_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/custom_objects/${custom_object_id}`);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "list_custom_object_records",
    {
      custom_object_id: z.number(),
      page: z.number().optional(),
      per_page: z.number().max(100).optional(),
      filter_by: z.string().optional()
    },
    async ({ custom_object_id, page, per_page, filter_by }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(
          `/custom_objects/${custom_object_id}/records`,
          { params: { page, per_page, filter_by } }
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_custom_object_record",
    {
      custom_object_id: z.number(),
      data: z.record(z.unknown())
    },
    async ({ custom_object_id, data }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(
          `/custom_objects/${custom_object_id}/records`,
          data
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "update_custom_object_record",
    {
      custom_object_id: z.number(),
      record_id: z.number(),
      data: z.record(z.unknown())
    },
    async ({ custom_object_id, record_id, data }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/custom_objects/${custom_object_id}/records/${record_id}`,
          data
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_custom_object_record",
    { custom_object_id: z.number(), record_id: z.number() },
    async ({ custom_object_id, record_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(
          `/custom_objects/${custom_object_id}/records/${record_id}`
        );
        return mcpResponse({ success: true, message: `Record ${record_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );

}
