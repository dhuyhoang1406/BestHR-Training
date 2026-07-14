import { isAxiosError } from 'axios';

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    const message =
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      body.message
        ? Array.isArray((body as { message: unknown }).message)
          ? ((body as { message: string[] }).message).join(', ')
          : String((body as { message: unknown }).message)
        : `Request failed with status ${status}`;
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export function toApiError(error: unknown): never {
  if (isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const body = error.response?.data ?? error.message;
    throw new ApiError(status, body);
  }
  throw error;
}
