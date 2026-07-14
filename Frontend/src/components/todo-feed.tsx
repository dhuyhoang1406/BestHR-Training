'use client';

import Link from 'next/link';
import { TODO_STATUSES } from '@/hooks/constants';
import { useTodoFeed } from '@/hooks/use-todo-feed';
import type { TodoStatus } from '@/lib/types';
import { BulkActionBar } from './bulk-action-bar';
import { CategoryBadges } from './category-badges';
import { UserLink } from './user-link';

interface TodoFeedProps {
  isArchived?: boolean;
}

export function TodoFeed({ isArchived = false }: TodoFeedProps) {
  const {
    search,
    selectedIds,
    todos,
    meta,
    isLoading,
    isError,
    error,
    isFetching,
    isAllSelected,
    isStatusPending,
    isArchivePending,
    isRestorePending,
    setSearch,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    goToPreviousPage,
    goToNextPage,
    changeStatus,
    archive,
    restore,
    canGoPrevious,
    canGoNext,
  } = useTodoFeed(isArchived);

  return (
    <div style={{ paddingBottom: 72 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <h2 style={{ margin: 0 }}>
          {isArchived ? 'Archived todos' : 'Todos'}
        </h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search todos..."
            style={{ padding: 8, minWidth: 220 }}
          />
          <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              disabled={isLoading || todos.length === 0}
            />
            Select page
          </label>
        </div>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p style={{ color: 'red' }}>{(error as Error).message}</p>
      ) : (
        <>
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
                        <UserLink userId={todo.userId}>
                          {todo.user.displayName}
                        </UserLink>
                        {' · '}
                      </>
                    ) : null}
                    {new Date(todo.createdAt).toLocaleString()}
                    {todo.deletedAt && (
                      <>
                        {' '}
                        · archived {new Date(todo.deletedAt).toLocaleString()}
                      </>
                    )}
                  </div>
                  <CategoryBadges categories={todo.categories} />
                </div>

                <select
                  value={todo.status}
                  disabled={isArchived || isStatusPending}
                  onChange={(e) =>
                    changeStatus(todo.id, e.target.value as TodoStatus)
                  }
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

                {isArchived ? (
                  <button
                    type="button"
                    disabled={isRestorePending}
                    onClick={() => restore(todo.id)}
                  >
                    Restore
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isArchivePending}
                    onClick={() => archive(todo.id)}
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
                  onClick={goToPreviousPage}
                  disabled={!canGoPrevious}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={!canGoNext}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <BulkActionBar
        selectedIds={selectedIds}
        onClearSelection={clearSelection}
      />
    </div>
  );
}
