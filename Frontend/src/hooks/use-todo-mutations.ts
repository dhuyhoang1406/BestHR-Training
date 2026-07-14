import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  archiveTodo,
  bulkDeleteTodos,
  createTodo,
  restoreTodo,
  updateTodoStatus,
} from '@/lib/api';
import { refreshTodoQueries } from '@/lib/query';
import type { CreateTodoPayload, TodoStatus } from '@/lib/types';

export function useUpdateTodoStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TodoStatus }) =>
      updateTodoStatus(id, status),
    onSuccess: async () => {
      await refreshTodoQueries(queryClient);
    },
  });
}

export function useArchiveTodo(options?: {
  onSuccess?: (id: string) => void | Promise<void>;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveTodo(id),
    onSuccess: async (_data, id) => {
      await refreshTodoQueries(queryClient);
      await options?.onSuccess?.(id);
    },
  });
}

export function useRestoreTodo(options?: {
  onSuccess?: (id: string) => void | Promise<void>;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => restoreTodo(id),
    onSuccess: async (_data, id) => {
      await refreshTodoQueries(queryClient);
      await options?.onSuccess?.(id);
    },
  });
}

export function useCreateTodo(options?: {
  onSuccess?: () => void | Promise<void>;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTodoPayload) => createTodo(payload),
    onSuccess: async () => {
      await refreshTodoQueries(queryClient);
      await options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

export function useBulkDeleteTodos(options?: {
  onSuccess?: () => void | Promise<void>;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteTodos,
    onSuccess: async () => {
      await refreshTodoQueries(queryClient);
      await options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
