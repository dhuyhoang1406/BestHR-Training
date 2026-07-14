import { useQuery } from '@tanstack/react-query';
import { fetchTodoById, fetchTodos, fetchUserTodos } from '@/lib/api';
import type { TodoStatus } from '@/lib/types';
import { queryKeys } from './query-keys';

export function useTodos(
  page: number,
  limit: number,
  isArchived = false,
  search = '',
) {
  return useQuery({
    queryKey: queryKeys.todos(page, limit, isArchived, search),
    queryFn: () => fetchTodos(page, limit, isArchived, search),
  });
}

export function useTodo(id: string) {
  return useQuery({
    queryKey: queryKeys.todo(id),
    queryFn: () => fetchTodoById(id),
    enabled: Boolean(id),
  });
}

export function useUserTodosQuery(
  userId: string,
  status: TodoStatus | 'ALL' = 'ALL',
) {
  return useQuery({
    queryKey: queryKeys.userTodos(userId, status),
    queryFn: () =>
      fetchUserTodos(userId, status === 'ALL' ? undefined : status),
    enabled: Boolean(userId),
  });
}
