import type { TodoStatus } from '@/lib/types';

export const queryKeys = {
  todos: (
    page: number,
    limit: number,
    isArchived: boolean,
    search = '',
  ) => ['todos', { page, limit, isArchived, search }] as const,
  todo: (id: string) => ['todo', id] as const,
  users: ['users'] as const,
  categories: ['categories'] as const,
  userTodos: (userId: string, status: TodoStatus | 'ALL') =>
    ['user-todos', userId, status] as const,
};
