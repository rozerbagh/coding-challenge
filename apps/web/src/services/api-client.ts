export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

function getApiBaseUrl(): string {
  const baseUrl =
    typeof window === 'undefined'
      ? process.env.API_INTERNAL_BASE_URL ??
        process.env.NEXT_PUBLIC_API_BASE_URL ??
        'http://localhost:3001/api/v1'
      : process.env.NEXT_PUBLIC_API_BASE_URL ??
        'http://localhost:3001/api/v1';
  return baseUrl.replace(/\/$/, '');
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiRequestError(
      'The catalogue service could not be reached. Please try again.',
      0,
    );
  }

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    const message =
      typeof payload === 'object' && payload !== null && 'message' in payload
        ? (payload as { message?: unknown }).message
        : null;
    throw new ApiRequestError(
      typeof message === 'string'
        ? message
        : 'The request could not be completed. Please try again.',
      response.status,
    );
  }

  return (await response.json()) as T;
}
