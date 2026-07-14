'use client';

import Link from 'next/link';
import { useState } from 'react';
import { USER_TODO_STATUSES } from '@/hooks/constants';
import { useUserTodosPanel } from '@/hooks/use-user-todos-panel';
import type { TodoStatus } from '@/lib/types';
import { CategoryBadges } from './category-badges';
import { CreateTodoForm } from './create-todo-form';

type UserTab = 'todos' | 'create';

export function UserDetailPanel() {
  const [tab, setTab] = useState<UserTab>('todos');
  const {
    userId,
    users,
    user,
    todos,
    status,
    isLoading,
    isError,
    error,
    changeStatus,
  } = useUserTodosPanel();

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 16,
          borderBottom: '1px solid #ddd',
          paddingBottom: 8,
        }}
      >
        {users.map((u) => {
          const active = u.id === userId;
          return (
            <Link
              key={u.id}
              href={`/users/${u.id}`}
              style={{
                padding: '6px 12px',
                textDecoration: 'none',
                color: active ? '#000' : '#555',
                fontWeight: active ? 700 : 400,
                borderBottom: active ? '2px solid #333' : '2px solid transparent',
              }}
            >
              {u.displayName}
            </Link>
          );
        })}
      </div>

      {user && (
        <p style={{ color: '#555', marginTop: 0 }}>
          {user.displayName} · {user.email}
        </p>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => setTab('todos')}
          style={{
            padding: '6px 12px',
            fontWeight: tab === 'todos' ? 700 : 400,
            border:
              tab === 'todos' ? '1px solid #333' : '1px solid #ccc',
            background: tab === 'todos' ? '#f5f5f5' : 'transparent',
            cursor: 'pointer',
          }}
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => setTab('create')}
          style={{
            padding: '6px 12px',
            fontWeight: tab === 'create' ? 700 : 400,
            border:
              tab === 'create' ? '1px solid #333' : '1px solid #ccc',
            background: tab === 'create' ? '#f5f5f5' : 'transparent',
            cursor: 'pointer',
          }}
        >
          Create todo
        </button>
      </div>

      {tab === 'create' ? (
        userId ? <CreateTodoForm userId={userId} /> : null
      ) : (
        <div>
          <label style={{ display: 'inline-block', marginBottom: 12 }}>
            Status:{' '}
            <select
              value={status}
              onChange={(e) =>
                changeStatus(e.target.value as TodoStatus | 'ALL')
              }
            >
              {USER_TODO_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          {isLoading && <p>Loading...</p>}
          {isError && (
            <p style={{ color: 'red' }}>{(error as Error).message}</p>
          )}

          {!isLoading && !isError && (
            <>
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
                      <Link
                        href={`/todos/${todo.id}`}
                        style={{ fontWeight: 600 }}
                      >
                        {todo.title}
                      </Link>
                      <span style={{ fontSize: 12 }}>{todo.status}</span>
                    </div>
                    <CategoryBadges categories={todo.categories} />
                  </li>
                ))}
              </ul>
              {todos?.length === 0 && <p>No todos for this filter.</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
