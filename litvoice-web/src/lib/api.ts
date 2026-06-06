export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "/api";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  const response = await fetch(`${baseUrl}${url}`, options);
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    const bodyPreview = (await response.text()).slice(0, 500);

    let message = `Request failed with status ${response.status}`;
    if (contentType.includes("application/json")) {
      try {
        const parsed = JSON.parse(bodyPreview) as { message?: unknown };
        if (typeof parsed.message === "string" && parsed.message.trim()) {
          message = parsed.message;
        } else if (bodyPreview) {
          message = bodyPreview;
        }
      } catch {
        if (bodyPreview) message = bodyPreview;
      }
    }

    throw new ApiError(response.status, message);
  }

  if (!contentType.includes("application/json")) {
    const preview = (await response.text()).slice(0, 120);
    throw new ApiError(
      response.status,
      `Expected JSON but got ${contentType || "unknown content type"}: ${preview}`,
    );
  }

  return response.json() as Promise<T>;
}
