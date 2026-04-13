import { getClient } from "./freshserviceClient.js";

export async function fetchAllPages(
  endpoint: string,
  params: Record<string, unknown> = {},
  sessionId: string
) {
  let page = 1;
  const per_page = 100;
  const results: any[] = [];

  while (true) {
    const response = await getClient(sessionId).get(endpoint, {
      params: {
        ...params,
        page,
        per_page,
      },
    });

    const firstKey = Object.keys(response.data)[0];
    const batch = response.data[firstKey];

    if (!Array.isArray(batch) || batch.length === 0) {
      break;
    }

    results.push(...batch);

    if (batch.length < per_page) {
      break;
    }

    page += 1;
  }

  return results;
}