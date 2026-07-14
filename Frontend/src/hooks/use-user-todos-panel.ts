import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { TodoStatus } from '@/lib/types';
import { useUserTodosQuery } from './use-todos';
import { useUsers } from './use-users';

export function useUserTodosPanel(userId: string) {
  const router = useRouter();
  const [status, setStatus] = useState<TodoStatus | 'ALL'>('ALL');

  const { data: users = [] } = useUsers();
  const query = useUserTodosQuery(userId, status);

  const user = users.find((u) => u.id === userId);

  function changeUser(nextUserId: string) {
    router.push(`/users/${nextUserId}`);
  }

  function changeStatus(nextStatus: TodoStatus | 'ALL') {
    setStatus(nextStatus);
  }

  return {
    users,
    user,
    todos: query.data,
    status,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    changeUser,
    changeStatus,
  };
}
