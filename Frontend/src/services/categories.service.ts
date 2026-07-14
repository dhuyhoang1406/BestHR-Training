import { api, request } from '@/lib/api';
import { API_ROUTES } from '@/lib/api.route';
import type { Category, CreateCategoryPayload } from '@/lib/types';

export async function fetchCategories(): Promise<Category[]> {
  return request(() => api.get<Category[]>(API_ROUTES.CATEGORIES));
}

export async function createCategory(
  payload: CreateCategoryPayload,
): Promise<Category> {
  return request(() =>
    api.post<Category>(API_ROUTES.CATEGORIES, payload),
  );
}
