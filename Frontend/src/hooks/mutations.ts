import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '@/services/categories.service';
import {
  archiveTodo,
  bulkDeleteTodos,
  createTodo,
  restoreTodo,
  updateTodoStatus,
} from '@/services/todos.service';
import { refreshTodoQueries } from '@/lib/query';
import type {
  CreateCategoryPayload,
  CreateTodoPayload,
  TodoStatus,
} from '@/lib/types';
import { queryKeys } from './query-keys';

// ── Todos ──────────────────────────────────────────────────────────────────

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

// ── Categories ─────────────────────────────────────────────────────────────

export function useCreateCategory(options?: {
  onSuccess?: () => void | Promise<void>;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      await options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
