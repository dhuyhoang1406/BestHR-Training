'use client';

import Link from 'next/link';
import { TODO_STATUSES } from '@/hooks/constants';
import { useTodoDetail } from '@/hooks/use-todo-detail';
import type { TodoStatus } from '@/lib/types';
import { CategoryBadges } from './category-badges';
import { UserLink } from './user-link';

export function DetailToDo() {
  const {
    todo,
    isArchived,
    isLoading,
    isError,
    error,
    isStatusPending,
    isArchivePending,
    isRestorePending,
    changeStatus,
    archive,
    restore,
  } = useTodoDetail();

  if (isLoading) return <p>Loading...</p>;
  if (isError) {
    return <p style={{ color: 'red' }}>{(error as Error).message}</p>;
  }
  if (!todo) return <p>Todo not found.</p>;

  return (
    <div>
      <p style={{ marginBottom: 16 }}>
        <Link href={isArchived ? '/archive' : '/'}>← Back</Link>
      </p>

      <h1 style={{ marginTop: 0 }}>{todo.title}</h1>
      <CategoryBadges categories={todo.categories} />

      <dl style={{ lineHeight: 1.8, marginTop: 16 }}>
        <dt>
          <strong>ID</strong>
        </dt>
        <dd style={{ margin: '0 0 12px', fontFamily: 'monospace' }}>{todo.id}</dd>

        <dt>
          <strong>Owner</strong>
        </dt>
        <dd style={{ margin: '0 0 12px' }}>
          {todo.user ? (
            <UserLink userId={todo.userId}>
              {todo.user.displayName} ({todo.user.email})
            </UserLink>
          ) : (
            todo.userId
          )}
        </dd>

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
            disabled={isArchived || isStatusPending}
            onChange={(e) => changeStatus(e.target.value as TodoStatus)}
            title={
              isArchived
                ? 'Restore the todo before changing status'
                : undefined
            }
          >
            {TODO_STATUSES.map((s) => (
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
          disabled={isRestorePending}
          onClick={restore}
        >
          {isRestorePending ? 'Restoring...' : 'Restore'}
        </button>
      ) : (
        <button
          type="button"
          disabled={isArchivePending}
          onClick={archive}
        >
          {isArchivePending ? 'Archiving...' : 'Archive'}
        </button>
      )}
    </div>
  );
}
