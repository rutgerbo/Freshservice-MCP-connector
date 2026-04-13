import { z } from "zod";
import { setSession } from "../sessionStore.js";

export function registerConfigureInstanceTool(server: any) {

  server.tool(
    "configure_freshservice_instance",
    {
      domain: z.string(),
      api_key: z.string()
    },
    async ({ domain, api_key }: any, ctx: any) => {

      setSession(ctx.sessionId, {
        domain,
        api_key
      });

      return {
        content: [
          {
            type: "text",
            text: `Configured Freshservice tenant: ${domain}`
          }
        ]
      };

    }
  );

}