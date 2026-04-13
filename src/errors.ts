export function handleApiError(error: any) {
  const message =
    error?.response?.data ||
    error?.message ||
    "Unknown Freshservice API error";

  console.error("Freshservice Error:", message);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            error: true,
            message
          },
          null,
          2
        )
      }
    ],
    isError: true
  };
}