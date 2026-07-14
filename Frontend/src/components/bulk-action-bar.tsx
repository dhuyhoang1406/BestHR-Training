'use client';

import { useBulkActionBar } from '@/hooks/use-bulk-action-bar';

interface BulkActionBarProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectedIds,
  onClearSelection,
}: BulkActionBarProps) {
  const { isVisible, selectedCount, isPending, deleteSelected } =
    useBulkActionBar(selectedIds, onClearSelection);

  if (!isVisible) return null;

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
      <span>{selectedCount} selected</span>
      <button
        type="button"
        onClick={deleteSelected}
        disabled={isPending}
        style={{ background: '#c00', color: '#fff', padding: '8px 12px' }}
      >
        {isPending ? 'Deleting...' : 'Delete selected'}
      </button>
    </div>
  );
}
