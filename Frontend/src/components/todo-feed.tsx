'use client';

import { useState } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { archiveTodo, fetchTodos, updateTodoStatus } from '@/lib/api';
import type { PaginatedTodosResponse, TodoStatus } from '@/lib/types';
import { BulkActionBar } from './bulk-action-bar';

const STATUSES: TodoStatus[] = ['PENDING', 'IN_PROGRESS', 'DONE'];
const LIMIT = 5;

interface TodoFeedProps {
  initialData?: PaginatedTodosResponse;
}

export function TodoFeed({ initialData }: TodoFeedProps) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey: ['todos', { page, limit: LIMIT }],
    queryFn: () => fetchTodos(page, LIMIT),
    placeholderData: keepPreviousData,
    initialData: page === 1 ? initialData : undefined,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TodoStatus }) =>
      updateTodoStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => archiveTodo(id),
    onSuccess: (_data, id) => {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      queryClient.invalidateQueries({ queryKey: ['todos'] });
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
        <h2 style={{ margin: 0 }}>Todos</h2>
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
          opacity: isPlaceholderData ? 0.5 : 1,
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
              <div style={{ fontWeight: 600 }}>{todo.title}</div>
              {todo.description && (
                <div style={{ color: '#555', fontSize: 14 }}>
                  {todo.description}
                </div>
              )}
              <div style={{ fontSize: 12, color: '#777', marginTop: 4 }}>
                {new Date(todo.createdAt).toLocaleString()}
              </div>
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

            <button
              type="button"
              disabled={archiveMutation.isPending}
              onClick={() => archiveMutation.mutate(todo.id)}
            >
              Archive
            </button>
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
              disabled={page <= 1 || isPlaceholderData}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isPlaceholderData && page < meta.totalPages) {
                  setPage((p) => p + 1);
                }
              }}
              disabled={page >= meta.totalPages || isPlaceholderData}
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
