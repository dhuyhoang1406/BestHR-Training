'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  archiveTodo,
  fetchTodoById,
  restoreTodo,
  updateTodoStatus,
} from '@/lib/api';
import type { TodoStatus } from '@/lib/types';

const STATUSES: TodoStatus[] = ['PENDING', 'IN_PROGRESS', 'DONE'];

export function DetailToDo() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: todo, isLoading, isError, error } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => fetchTodoById(id),
    enabled: Boolean(id),
  });

  const statusMutation = useMutation({
    mutationFn: (status: TodoStatus) => updateTodoStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo', id] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: () => archiveTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      router.push('/?isArchived=true');
    },
  });

  const restoreMutation = useMutation({
    mutationFn: () => restoreTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo', id] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      router.push('/');
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) {
    return <p style={{ color: 'red' }}>{(error as Error).message}</p>;
  }
  if (!todo) return <p>Todo not found.</p>;

  const isArchived = Boolean(todo.deletedAt);

  return (
    <div>
      <p style={{ marginBottom: 16 }}>
        <Link href={isArchived ? '/?isArchived=true' : '/'}>← Back</Link>
      </p>

      <h1 style={{ marginTop: 0 }}>{todo.title}</h1>

      <dl style={{ lineHeight: 1.8 }}>
        <dt>
          <strong>ID</strong>
        </dt>
        <dd style={{ margin: '0 0 12px', fontFamily: 'monospace' }}>{todo.id}</dd>

        <dt>
          <strong>Description</strong>
        </dt>
        <dd style={{ margin: '0 0 12px' }}>
          {todo.description || '(none)'}
        </dd>

        <dt>
          <strong>Status</strong>
        </dt>
        <dd style={{ margin: '0 0 12px' }}>
          <select
            value={todo.status}
            disabled={statusMutation.isPending}
            onChange={(e) =>
              statusMutation.mutate(e.target.value as TodoStatus)
            }
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </dd>

        <dt>
          <strong>Created</strong>
        </dt>
        <dd style={{ margin: '0 0 12px' }}>
          {new Date(todo.createdAt).toLocaleString()}
        </dd>

        <dt>
          <strong>Updated</strong>
        </dt>
        <dd style={{ margin: '0 0 12px' }}>
          {new Date(todo.updatedAt).toLocaleString()}
        </dd>

        {todo.deletedAt && (
          <>
            <dt>
              <strong>Archived</strong>
            </dt>
            <dd style={{ margin: '0 0 12px' }}>
              {new Date(todo.deletedAt).toLocaleString()}
            </dd>
          </>
        )}
      </dl>

      {isArchived ? (
        <button
          type="button"
          disabled={restoreMutation.isPending}
          onClick={() => restoreMutation.mutate()}
        >
          {restoreMutation.isPending ? 'Restoring...' : 'Restore'}
        </button>
      ) : (
        <button
          type="button"
          disabled={archiveMutation.isPending}
          onClick={() => archiveMutation.mutate()}
        >
          {archiveMutation.isPending ? 'Archiving...' : 'Archive'}
        </button>
      )}
    </div>
  );
}
