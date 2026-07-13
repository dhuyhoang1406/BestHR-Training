'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkDeleteTodos } from '@/lib/api';
import { refreshTodoQueries } from '@/lib/query';

interface BulkActionBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectedIds,
  onClearSelection,
}: BulkActionBarProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: bulkDeleteTodos,
    onSuccess: async () => {
      onClearSelection();
      await refreshTodoQueries(queryClient);
    },
    onError: (error) => {
      console.error(error);
      alert('Could not delete tasks. Please try again.');
    },
  });

  if (selectedIds.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        background: '#fff',
        borderTop: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      <span>{selectedIds.length} selected</span>
      <button
        type="button"
        onClick={() => mutate(selectedIds)}
        disabled={isPending}
        style={{ background: '#c00', color: '#fff', padding: '8px 12px' }}
      >
        {isPending ? 'Deleting...' : 'Delete selected'}
      </button>
    </div>
  );
}
