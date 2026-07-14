import type { TodoStatus } from '@/lib/types';

export const TODO_STATUSES: TodoStatus[] = ['PENDING', 'IN_PROGRESS', 'DONE'];

export const TODOS_PAGE_LIMIT = 5;

export const SEARCH_DEBOUNCE_MS = 500;

export const USER_TODO_STATUSES: Array<TodoStatus | 'ALL'> = [
  'ALL',
  'PENDING',
  'IN_PROGRESS',
  'DONE',
];
