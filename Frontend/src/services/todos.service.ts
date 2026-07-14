import { api, request } from '@/lib/api';
import { API_ROUTES } from '@/lib/api.route';
import type {
  CreateTodoPayload,
  PaginatedTodosResponse,
  Todo,
  TodoStatus,
} from '@/lib/types';

export async function fetchTodos(
  page: number,
  limit: number,
  isArchived = false,
  search?: string,
): Promise<PaginatedTodosResponse> {
  const trimmedSearch = search?.trim();
  const path = isArchived ? API_ROUTES.TODOS_ARCHIVED : API_ROUTES.TODOS;
  return request(() =>
    api.get<PaginatedTodosResponse>(path, {
      params: {
        limit,
        page,
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
      },
    }),
  );
}

export async function fetchTodoById(id: string): Promise<Todo> {
  return request(() => api.get<Todo>(API_ROUTES.TODO_BY_ID(id)));
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
