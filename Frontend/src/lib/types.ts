export type TodoStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  status: TodoStatus;
  userId: string;
  user?: User;
  categories?: Category[];
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
  userId: string;
  categoryIds?: string[];
}
