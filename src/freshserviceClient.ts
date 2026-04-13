import axios from "axios";
import { getSession } from "./sessionStore.js";

export function getClient(sessionId: string) {
  const session = getSession(sessionId);

  if (!session) {
    throw new Error(
      "Freshservice instance not configured. Run configure_freshservice_instance first."
    );
  }

  return axios.create({
    baseURL: `https://${session.domain}/api/v2`,
    auth: {
      username: session.api_key,
      password: "X",
    },
  });
}