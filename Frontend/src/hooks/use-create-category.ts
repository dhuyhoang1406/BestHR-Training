import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '@/lib/api';
import type { CreateCategoryPayload } from '@/lib/types';
import { queryKeys } from './query-keys';

export function useCreateCategory(options?: {
  onSuccess?: () => void | Promise<void>;
  onError?: (error: unknown) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      await options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
