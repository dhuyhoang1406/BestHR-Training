import { api, request } from '@/lib/api';
import { API_ROUTES } from '@/lib/api.route';
import type { User } from '@/lib/types';

export async function fetchUsers(): Promise<User[]> {
  return request(() => api.get<User[]>(API_ROUTES.USERS));
}
