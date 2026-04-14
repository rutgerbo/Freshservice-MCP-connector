export function handleApiError(error: any) {
  // error.response.data can be a complex object that isn't safely serializable.
  // Coerce to a plain value so JSON.stringify never throws here.
  let message: unknown;
  try {
    const raw = error?.response?.data || error?.message || "Unknown Freshservice API error";
    // Ensure it round-trips through JSON cleanly; if it can't, stringify it first.
    JSON.stringify(raw);
    message = raw;
  } catch {
    message = String(error?.response?.data ?? error?.message ?? "Unknown Freshservice API error");
  }

  console.error("Freshservice Error:", message);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({ error: true, message }, null, 2)
      }
    ],
    isError: true
  };
}