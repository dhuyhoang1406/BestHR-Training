import axios, { isAxiosError } from 'axios';
import type {
  Category,
  CreateTodoPayload,
  PaginatedTodosResponse,
  Todo,
  TodoStatus,
  User,
} from './types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

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

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

function toApiError(error: unknown): never {
  if (isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const body = error.response?.data ?? error.message;
    throw new ApiError(status, body);
  }
  throw error;
}

async function request<T>(fn: () => Promise<{ data: T }>): Promise<T> {
  try {
    const { data } = await fn();
    return data;
  } catch (error) {
    toApiError(error);
  }
}

export async function fetchTodos(
  page: number,
  limit: number,
  isArchived = false,
): Promise<PaginatedTodosResponse> {
  return request(() =>
    api.get<PaginatedTodosResponse>('/todos', {
      params: {
        limit,
        page,
        ...(isArchived ? { isArchived: true } : {}),
      },
    }),
  );
}

export async function fetchTodoById(id: string): Promise<Todo> {
  return request(() => api.get<Todo>(`/todos/${id}`));
}

export async function fetchUsers(): Promise<User[]> {
  return request(() => api.get<User[]>('/users'));
}

export async function fetchCategories(): Promise<Category[]> {
  return request(() => api.get<Category[]>('/categories'));
}

export async function fetchUserTodos(
  userId: string,
  status?: TodoStatus,
): Promise<Todo[]> {
  return request(() =>
    api.get<Todo[]>(`/users/${userId}/todos`, {
      params: status ? { status } : undefined,
    }),
  );
}

export async function createTodo(payload: CreateTodoPayload): Promise<Todo> {
  return request(() => api.post<Todo>('/todos', payload));
}

export async function updateTodoStatus(
  id: string,
  status: TodoStatus,
): Promise<Todo> {
  return request(() =>
    api.patch<Todo>(`/todos/${id}/status`, { status }),
  );
}

export async function archiveTodo(id: string): Promise<Todo> {
  return request(() => api.patch<Todo>(`/todos/${id}/archive`));
}

export async function restoreTodo(id: string): Promise<Todo> {
  return request(() => api.patch<Todo>(`/todos/${id}/restore`));
}

export async function bulkDeleteTodos(ids: string[]): Promise<void> {
  return request(() => api.post<void>('/todos/bulk-delete', { ids }));
}
