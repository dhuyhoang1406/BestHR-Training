export type TodoStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedTodosResponse {
  data: Todo[];
  meta: PaginationMeta;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
}
