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
    const message = contentType.includes("application/json")
      ? bodyPreview || `Request failed with status ${response.status}`
      : `Request failed with status ${response.status}`;

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
