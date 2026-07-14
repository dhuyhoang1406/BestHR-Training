import { useParams } from 'next/navigation';
import { useState } from 'react';
import type { TodoStatus } from '@/lib/types';
import { useUserTodosQuery, useUsers } from './queries';

export function useUserTodosPanel() {
  const params = useParams<{ id: string }>();
  const userId = params.id;
  const [status, setStatus] = useState<TodoStatus | 'ALL'>('ALL');

  const { data: users = [] } = useUsers();
  const query = useUserTodosQuery(userId, status);

  const user = users.find((u) => u.id === userId);

  function changeStatus(nextStatus: TodoStatus | 'ALL') {
    setStatus(nextStatus);
  }

  return {
    userId,
    users,
    user,
    todos: query.data,
    status,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    changeStatus,
  };
}
