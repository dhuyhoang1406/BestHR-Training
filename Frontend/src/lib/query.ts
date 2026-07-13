import type { QueryClient } from '@tanstack/react-query';

/** Force-refetch todo-related caches (active queries). */
export async function refreshTodoQueries(queryClient: QueryClient) {
  await Promise.all([
    queryClient.refetchQueries({ queryKey: ['todos'] }),
    queryClient.refetchQueries({ queryKey: ['user-todos'] }),
    queryClient.invalidateQueries({ queryKey: ['todo'] }),
  ]);
}
