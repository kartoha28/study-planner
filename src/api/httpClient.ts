const RAW_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
const API_BASE_URL = (RAW_BASE_URL ?? 'https://dummyjson.com').replace(
  /\/+$/,
  '',
);

export class ApiError extends Error {
  public readonly status?: number;
  public readonly isAborted: boolean;

  constructor(
    message: string,
    options?: { status?: number; isAborted?: boolean },
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options?.status;
    this.isAborted = options?.isAborted ?? false;
  }
}

export function isAbortError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.isAborted;
  }
  return error instanceof DOMException && error.name === 'AbortError';
}

export function normalizeHttpError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return new ApiError('Запит було скасовано', { isAborted: true });
  }

  if (error instanceof TypeError) {
    return new ApiError(
      'Помилка мережі: перевірте підключення до інтернету або доступність API.',
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('Невідома помилка під час виконання запиту.');
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, signal } = options;
  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  try {
    const response = await fetch(url, {
      method,
      signal,
      headers:
        body !== undefined
          ? { 'Content-Type': 'application/json' }
          : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let serverMessage = `Помилка сервера (HTTP ${response.status})`;
      try {
        const errorBody = (await response.json()) as { message?: string };
        if (errorBody?.message) {
          serverMessage = `${errorBody.message} (HTTP ${response.status})`;
        }
      } catch {
        // Ігноруємо помилку парсингу тіла помилки
      }
      throw new ApiError(serverMessage, { status: response.status });
    }

    return (await response.json()) as T;
  } catch (error) {
    throw normalizeHttpError(error);
  }
}

export const httpClient = {
  get: <T>(endpoint: string, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'GET', signal }),

  post: <T>(endpoint: string, body: unknown, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'POST', body, signal }),

  patch: <T>(endpoint: string, body: unknown, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'PATCH', body, signal }),

  put: <T>(endpoint: string, body: unknown, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'PUT', body, signal }),

  delete: <T>(endpoint: string, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'DELETE', signal }),
};
