'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  archiveTodo,
  fetchTodos,
  restoreTodo,
  updateTodoStatus,
} from '@/lib/api';
import { refreshTodoQueries } from '@/lib/query';
import type { TodoStatus } from '@/lib/types';
import { BulkActionBar } from './bulk-action-bar';
import { CategoryBadges } from './category-badges';

const STATUSES: TodoStatus[] = ['PENDING', 'IN_PROGRESS', 'DONE'];
const LIMIT = 5;

interface TodoFeedProps {
  isArchived?: boolean;
}

export function TodoFeed({ isArchived = false }: TodoFeedProps) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['todos', { page, limit: LIMIT, isArchived }],
    queryFn: () => fetchTodos(page, LIMIT, isArchived),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TodoStatus }) =>
      updateTodoStatus(id, status),
    onSuccess: async () => {
      await refreshTodoQueries(queryClient);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => archiveTodo(id),
    onSuccess: async (_data, id) => {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      await refreshTodoQueries(queryClient);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => restoreTodo(id),
    onSuccess: async (_data, id) => {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      await refreshTodoQueries(queryClient);
    },
  });

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleSelectAll() {
    const ids = data?.data.map((t) => t.id) ?? [];
    const allSelected =
      ids.length > 0 && ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  }

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p style={{ color: 'red' }}>{(error as Error).message}</p>;

  const todos = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div style={{ paddingBottom: 72 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>
          {isArchived ? 'Archived todos' : 'Todos'}
        </h2>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={
              todos.length > 0 &&
              todos.every((t) => selectedIds.includes(t.id))
            }
            onChange={toggleSelectAll}
          />
          Select page
        </label>
      </div>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          opacity: isFetching ? 0.6 : 1,
        }}
      >
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              border: '1px solid #ccc',
              padding: 12,
              marginBottom: 8,
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(todo.id)}
              onChange={() => toggleSelect(todo.id)}
              style={{ marginTop: 4 }}
            />

            <div style={{ flex: 1 }}>
              <Link
                href={`/todos/${todo.id}`}
                style={{ fontWeight: 600, color: 'inherit' }}
              >
                {todo.title}
              </Link>
              {todo.description && (
                <div style={{ color: '#555', fontSize: 14 }}>
                  {todo.description}
                </div>
              )}
              <div style={{ fontSize: 12, color: '#777', marginTop: 4 }}>
                {todo.user ? (
                  <>
                    <Link href={`/users/${todo.userId}`}>
                      {todo.user.displayName}
                    </Link>
                    {' · '}
                  </>
                ) : null}
                {new Date(todo.createdAt).toLocaleString()}
                {todo.deletedAt && (
                  <> · archived {new Date(todo.deletedAt).toLocaleString()}</>
                )}
              </div>
              <CategoryBadges categories={todo.categories} />
            </div>

            <select
              value={todo.status}
              disabled={statusMutation.isPending}
              onChange={(e) =>
                statusMutation.mutate({
                  id: todo.id,
                  status: e.target.value as TodoStatus,
                })
              }
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {isArchived ? (
              <button
                type="button"
                disabled={restoreMutation.isPending}
                onClick={() => restoreMutation.mutate(todo.id)}
              >
                Restore
              </button>
            ) : (
              <button
                type="button"
                disabled={archiveMutation.isPending}
                onClick={() => archiveMutation.mutate(todo.id)}
              >
                Archive
              </button>
            )}
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p>No todos.</p>}

      {meta && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            borderTop: '1px solid #ddd',
            paddingTop: 12,
          }}
        >
          <span>
            Page {meta.page} / {meta.totalPages} ({meta.total} total)
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1 || isFetching}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isFetching && page < meta.totalPages) {
                  setPage((p) => p + 1);
                }
              }}
              disabled={page >= meta.totalPages || isFetching}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <BulkActionBar
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
      />
    </div>
  );
}
