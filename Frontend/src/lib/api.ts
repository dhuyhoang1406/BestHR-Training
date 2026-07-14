import axios, { isAxiosError } from 'axios';
import { API_ROUTES } from './api.route';
import type {
  Category,
  CreateCategoryPayload,
  CreateTodoPayload,
  PaginatedTodosResponse,
  Todo,
  TodoStatus,
  User,
} from './types';

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
  search?: string,
): Promise<PaginatedTodosResponse> {
  const trimmedSearch = search?.trim();
  return request(() =>
    api.get<PaginatedTodosResponse>(API_ROUTES.TODOS, {
      params: {
        limit,
        page,
        ...(isArchived ? { isArchived: true } : {}),
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
      },
    }),
  );
}

export async function fetchTodoById(id: string): Promise<Todo> {
  return request(() => api.get<Todo>(API_ROUTES.TODO_BY_ID(id)));
}

export async function fetchUsers(): Promise<User[]> {
  return request(() => api.get<User[]>(API_ROUTES.USERS));
}

export async function fetchCategories(): Promise<Category[]> {
  return request(() => api.get<Category[]>(API_ROUTES.CATEGORIES));
}

export async function createCategory(
  payload: CreateCategoryPayload,
): Promise<Category> {
  return request(() =>
    api.post<Category>(API_ROUTES.CATEGORIES, payload),
  );
}

export async function fetchUserTodos(
  userId: string,
  status?: TodoStatus,
): Promise<Todo[]> {
  return request(() =>
    api.get<Todo[]>(API_ROUTES.USER_TODOS(userId), {
      params: status ? { status } : undefined,
    }),
  );
}

export async function createTodo(payload: CreateTodoPayload): Promise<Todo> {
  return request(() => api.post<Todo>(API_ROUTES.TODOS, payload));
}

export async function updateTodoStatus(
  id: string,
  status: TodoStatus,
): Promise<Todo> {
  return request(() =>
    api.patch<Todo>(API_ROUTES.TODO_STATUS(id), { status }),
  );
}

export async function archiveTodo(id: string): Promise<Todo> {
  return request(() => api.patch<Todo>(API_ROUTES.TODO_ARCHIVE(id)));
}

export async function restoreTodo(id: string): Promise<Todo> {
  return request(() => api.patch<Todo>(API_ROUTES.TODO_RESTORE(id)));
}

export async function bulkDeleteTodos(ids: string[]): Promise<void> {
  return request(() =>
    api.post<void>(API_ROUTES.TODOS_BULK_DELETE, { ids }),
  );
}
