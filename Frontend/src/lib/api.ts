import type {
  CreateTodoPayload,
  PaginatedTodosResponse,
  Todo,
  TodoStatus,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export async function fetchTodos(
  page: number,
  limit: number,
): Promise<PaginatedTodosResponse> {
  const res = await fetch(
    `${API_URL}/todos?limit=${limit}&page=${page}`,
    { cache: 'no-store' },
  );
  return handleResponse<PaginatedTodosResponse>(res);
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

export async function bulkDeleteTodos(ids: string[]): Promise<void> {
  const res = await fetch(`${API_URL}/todos/bulk-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  return handleResponse<void>(res);
}
