import { useParams, useRouter } from 'next/navigation';
import type { TodoStatus } from '@/lib/types';
import {
  useArchiveTodo,
  useRestoreTodo,
  useUpdateTodoStatus,
} from './mutations';
import { useTodo } from './queries';

export function useTodoDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const query = useTodo(id);

  const statusMutation = useUpdateTodoStatus();

  const archiveMutation = useArchiveTodo({
    onSuccess: async () => {
      router.push('/archive');
    },
  });

  const restoreMutation = useRestoreTodo({
    onSuccess: async () => {
      router.push('/');
    },
  });

  const todo = query.data;
  const isArchived = Boolean(todo?.deletedAt);

  function changeStatus(status: TodoStatus) {
    statusMutation.mutate({ id, status });
  }

  function archive() {
    archiveMutation.mutate(id);
  }

  function restore() {
    restoreMutation.mutate(id);
  }

  return {
    todo,
    isArchived,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isStatusPending: statusMutation.isPending,
    isArchivePending: archiveMutation.isPending,
    isRestorePending: restoreMutation.isPending,
    changeStatus,
    archive,
    restore,
  };
}
