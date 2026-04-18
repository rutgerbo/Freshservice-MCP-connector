import { z } from "zod";
import { setSession } from "../sessionStore.js";

export function registerConfigureInstanceTool(server: any) {

  server.tool(
    "configure_freshservice_instance",
    {
      domain: z.string(),
      api_key: z.string(),
      workspace_id: z.number().optional()
    },
    async ({ domain, api_key, workspace_id }: any, ctx: any) => {

      setSession(ctx.sessionId, {
        domain,
        api_key,
        workspace_id: workspace_id ?? 2
      });

      return {
        content: [
          {
            type: "text",
            text: `Configured Freshservice tenant: ${domain} (workspace_id: ${workspace_id ?? 2})`
          }
        ]
      };

    }
  );

}