'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserTodos, fetchUsers } from '@/lib/api';
import type { TodoStatus } from '@/lib/types';
import { CategoryBadges } from './category-badges';

const STATUSES: Array<TodoStatus | 'ALL'> = [
  'ALL',
  'PENDING',
  'IN_PROGRESS',
  'DONE',
];

export function UserTodosPanel({ userId }: { userId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<TodoStatus | 'ALL'>('ALL');

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const { data: todos, isLoading, isError, error } = useQuery({
    queryKey: ['user-todos', userId, status],
    queryFn: () =>
      fetchUserTodos(userId, status === 'ALL' ? undefined : status),
    enabled: Boolean(userId),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p style={{ color: 'red' }}>{(error as Error).message}</p>;

  const user = users.find((u) => u.id === userId);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          marginBottom: 16,
          alignItems: 'center',
        }}
      >
        <label>
          User:{' '}
          <select
            value={userId}
            onChange={(e) => router.push(`/users/${e.target.value}`)}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.displayName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status:{' '}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TodoStatus | 'ALL')}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      {user && (
        <p style={{ color: '#555' }}>
          {user.displayName} · {user.email}
        </p>
      )}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {todos?.map((todo) => (
          <li
            key={todo.id}
            style={{
              border: '1px solid #ccc',
              padding: 12,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <Link href={`/todos/${todo.id}`} style={{ fontWeight: 600 }}>
                {todo.title}
              </Link>
              <span style={{ fontSize: 12 }}>{todo.status}</span>
            </div>
            <CategoryBadges categories={todo.categories} />
          </li>
        ))}
      </ul>

      {todos?.length === 0 && <p>No todos for this filter.</p>}
    </div>
  );
}
