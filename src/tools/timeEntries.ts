import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

const parentTypeSchema = z.enum(["tickets", "problems", "changes", "releases"]);

export function registerTimeEntryTools(server: any) {

  server.tool(
    "list_time_entries",
    {
      parent_type: parentTypeSchema,
      parent_id: z.number()
    },
    async ({ parent_type, parent_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(`/${parent_type}/${parent_id}/time_entries`);
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "create_time_entry",
    {
      parent_type: parentTypeSchema,
      parent_id: z.number(),
      agent_id: z.number().optional(),
      time_spent: z.string(),
      billable: z.boolean().optional(),
      note: z.string().optional(),
      executed_at: z.string().optional(),
      task_id: z.number().optional()
    },
    async ({ parent_type, parent_id, ...entryData }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post(
          `/${parent_type}/${parent_id}/time_entries`,
          entryData
        );
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "update_time_entry",
    {
      parent_type: parentTypeSchema,
      parent_id: z.number(),
      time_entry_id: z.number(),
      agent_id: z.number().optional(),
      time_spent: z.string().optional(),
      billable: z.boolean().optional(),
      note: z.string().optional(),
      executed_at: z.string().optional()
    },
    async ({ parent_type, parent_id, time_entry_id, ...entryData }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/${parent_type}/${parent_id}/time_entries/${time_entry_id}`,
          entryData
        );
        return mcpResponse(res.data);
      } catch (e) {
        return handleApiError(e);
      }
    }
  );


  server.tool(
    "delete_time_entry",
    {
      parent_type: parentTypeSchema,
      parent_id: z.number(),
      time_entry_id: z.number()
    },
    async ({ parent_type, parent_id, time_entry_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(
          `/${parent_type}/${parent_id}/time_entries/${time_entry_id}`
        );
        return mcpResponse({ success: true, message: `Time entry ${time_entry_id} deleted.` });
      } catch (e) {
        return handleApiError(e);
      }
    }
  );

}
