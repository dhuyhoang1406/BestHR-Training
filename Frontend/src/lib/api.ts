import axios from 'axios';
import { toApiError } from './api-error';

export const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function request<T>(fn: () => Promise<{ data: T }>): Promise<T> {
  try {
    const { data } = await fn();
    return data;
  } catch (error) {
    toApiError(error);
  }
}
