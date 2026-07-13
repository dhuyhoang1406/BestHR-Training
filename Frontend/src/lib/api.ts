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

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = await res.text().catch(() => null);
    }
    throw new ApiError(res.status, body);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export async function fetchTodos(
  page: number,
  limit: number,
  isArchived = false,
): Promise<PaginatedTodosResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
  });
  if (isArchived) {
    params.set('isArchived', 'true');
  }
  const res = await fetch(`${API_URL}/todos?${params}`, {
    cache: 'no-store',
  });
  return handleResponse<PaginatedTodosResponse>(res);
}

export async function fetchTodoById(id: string): Promise<Todo> {
  const res = await fetch(`${API_URL}/todos/${id}`, { cache: 'no-store' });
  return handleResponse<Todo>(res);
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL}/users`, { cache: 'no-store' });
  return handleResponse<User[]>(res);
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
  return handleResponse<Category[]>(res);
}

export async function fetchUserTodos(
  userId: string,
  status?: TodoStatus,
): Promise<Todo[]> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  const qs = params.toString();
  const res = await fetch(
    `${API_URL}/users/${userId}/todos${qs ? `?${qs}` : ''}`,
    { cache: 'no-store' },
  );
  return handleResponse<Todo[]>(res);
}

export async function createTodo(payload: CreateTodoPayload): Promise<Todo> {
  const res = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Todo>(res);
}

export async function updateTodoStatus(
  id: string,
  status: TodoStatus,
): Promise<Todo> {
  const res = await fetch(`${API_URL}/todos/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return handleResponse<Todo>(res);
}

export async function archiveTodo(id: string): Promise<Todo> {
  const res = await fetch(`${API_URL}/todos/${id}/archive`, {
    method: 'PATCH',
  });
  return handleResponse<Todo>(res);
}

export async function restoreTodo(id: string): Promise<Todo> {
  const res = await fetch(`${API_URL}/todos/${id}/restore`, {
    method: 'PATCH',
  });
  return handleResponse<Todo>(res);
}

export async function bulkDeleteTodos(ids: string[]): Promise<void> {
  const res = await fetch(`${API_URL}/todos/bulk-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  return handleResponse<void>(res);
}
