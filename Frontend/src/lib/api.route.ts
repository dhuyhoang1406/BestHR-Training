const BACKEND =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ??
  'http://localhost:3001';

export const API_ROUTES = {
  // ── Todos ────────────────────────────────────────────────────────────────
  TODOS: `${BACKEND}/todos`,
  TODO_BY_ID: (id: string) => `${BACKEND}/todos/${id}`,
  TODO_STATUS: (id: string) => `${BACKEND}/todos/${id}/status`,
  TODO_ARCHIVE: (id: string) => `${BACKEND}/todos/${id}/archive`,
  TODO_RESTORE: (id: string) => `${BACKEND}/todos/${id}/restore`,
  TODOS_BULK_DELETE: `${BACKEND}/todos/bulk-delete`,

  // ── Users ────────────────────────────────────────────────────────────────
  USERS: `${BACKEND}/users`,
  USER_TODOS: (userId: string) => `${BACKEND}/users/${userId}/todos`,

  // ── Categories ───────────────────────────────────────────────────────────
  CATEGORIES: `${BACKEND}/categories`,
} as const;
