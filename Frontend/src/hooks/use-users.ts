import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/api';
import { queryKeys } from './query-keys';

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: fetchUsers,
  });
}
