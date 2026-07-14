import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/lib/api';
import { queryKeys } from './query-keys';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
  });
}
