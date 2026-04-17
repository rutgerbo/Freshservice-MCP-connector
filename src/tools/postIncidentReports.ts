import { z } from "zod";
import { getClient } from "../freshserviceClient.js";
import { mcpResponse } from "../response.js";
import { handleApiError } from "../errors.js";

export function registerPostIncidentReportTools(server: any) {

  server.tool(
    "list_pir_templates",
    {},
    async (_: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get("/post_incident_report_templates");
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "get_pir_template",
    { template_id: z.number() },
    async ({ template_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(
          `/post_incident_report_templates/${template_id}`
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "create_pir_template",
    {
      name: z.string(),
      description: z.string().optional(),
      sections: z.array(z.record(z.unknown())).optional()
    },
    async (params: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).post("/post_incident_report_templates", params);
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "delete_pir_template",
    { template_id: z.number() },
    async ({ template_id }: any, ctx: any) => {
      try {
        await getClient(ctx.sessionId).delete(`/post_incident_report_templates/${template_id}`);
        return mcpResponse({ success: true, message: `PIR template ${template_id} deleted.` });
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "enable_pir_template",
    { template_id: z.number() },
    async ({ template_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/post_incident_report_templates/${template_id}/enable`,
          {}
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "mark_pir_template_primary",
    { template_id: z.number() },
    async ({ template_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).put(
          `/post_incident_report_templates/${template_id}/mark_primary`,
          {}
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );


  server.tool(
    "export_pir_template",
    { template_id: z.number() },
    async ({ template_id }: any, ctx: any) => {
      try {
        const res = await getClient(ctx.sessionId).get(
          `/post_incident_report_templates/${template_id}/export`
        );
        return mcpResponse(res.data);
      } catch (e) { return handleApiError(e); }
    }
  );

}
