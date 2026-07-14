import { useEffect, useState } from 'react';
import type { TodoStatus } from '@/lib/types';
import { TODOS_PAGE_LIMIT } from './constants';
import { useDebounce } from './use-debounce';
import {
  useArchiveTodo,
  useRestoreTodo,
  useUpdateTodoStatus,
} from './use-todo-mutations';
import { useTodos } from './use-todos';
import { SEARCH_DEBOUNCE_MS } from './constants';

export function useTodoFeed(isArchived = false) {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchInput.trim(), SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, isArchived]);

  const query = useTodos(
    page,
    TODOS_PAGE_LIMIT,
    isArchived,
    debouncedSearch,
  );

  const statusMutation = useUpdateTodoStatus();

  const archiveMutation = useArchiveTodo({
    onSuccess: (id) => {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    },
  });

  const restoreMutation = useRestoreTodo({
    onSuccess: (id) => {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    },
  });

  const todos = query.data?.data ?? [];
  const meta = query.data?.meta;

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleSelectAll() {
    const ids = todos.map((t) => t.id);
    const allSelected =
      ids.length > 0 && ids.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : ids);
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  function goToPreviousPage() {
    setPage((p) => Math.max(p - 1, 1));
  }

  function goToNextPage() {
    if (!query.isFetching && meta && page < meta.totalPages) {
      setPage((p) => p + 1);
    }
  }

  function changeStatus(id: string, status: TodoStatus) {
    statusMutation.mutate({ id, status });
  }

  function archive(id: string) {
    archiveMutation.mutate(id);
  }

  function restore(id: string) {
    restoreMutation.mutate(id);
  }

  function setSearch(value: string) {
    setSearchInput(value);
  }

  return {
    page,
    search: searchInput,
    selectedIds,
    todos,
    meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    isAllSelected:
      todos.length > 0 && todos.every((t) => selectedIds.includes(t.id)),
    isStatusPending: statusMutation.isPending,
    isArchivePending: archiveMutation.isPending,
    isRestorePending: restoreMutation.isPending,
    setSearch,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    goToPreviousPage,
    goToNextPage,
    changeStatus,
    archive,
    restore,
    canGoPrevious: page > 1 && !query.isFetching,
    canGoNext: Boolean(meta && page < meta.totalPages && !query.isFetching),
  };
}
