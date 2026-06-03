export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const response  = await fetch (`${import.meta.env.VITE_API_BASE_URL ?? '/api'}${url}`, options);
    if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(response.status, errorText);
    }
    return response.json() as Promise<T>;
}