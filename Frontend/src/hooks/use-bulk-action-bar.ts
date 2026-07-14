import { useBulkDeleteTodos } from './mutations';

export function useBulkActionBar(
  selectedIds: string[],
  onClearSelection: () => void,
) {
  const mutation = useBulkDeleteTodos({
    onSuccess: async () => {
      onClearSelection();
    },
    onError: (error) => {
      console.error(error);
      alert('Could not delete tasks. Please try again.');
    },
  });

  function deleteSelected() {
    mutation.mutate(selectedIds);
  }

  return {
    isVisible: selectedIds.length > 0,
    selectedCount: selectedIds.length,
    isPending: mutation.isPending,
    deleteSelected,
  };
}
