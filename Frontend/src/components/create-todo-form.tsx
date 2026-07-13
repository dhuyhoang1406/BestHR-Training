'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, createTodo, fetchCategories, fetchUsers } from '@/lib/api';
import { refreshTodoQueries } from '@/lib/query';
import {
  createTodoSchema,
  type CreateTodoInput,
} from '@/lib/schemas/todo.schema';

export function CreateTodoForm() {
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      userId: '',
      categoryIds: [],
    },
  });

  const selectedCategoryIds = watch('categoryIds') ?? [];

  useEffect(() => {
    if (users.length > 0) {
      setValue('userId', users[0].id, { shouldValidate: false });
    }
  }, [users, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: createTodo,
    onSuccess: async () => {
      reset({
        title: '',
        description: '',
        userId: users[0]?.id ?? '',
        categoryIds: [],
      });
      await refreshTodoQueries(queryClient);
    },
    onError: (err: unknown) => {
      if (err instanceof ApiError) {
        const msg = err.message.toLowerCase();
        if (msg.includes('title')) {
          setError('title', { message: err.message });
          return;
        }
        if (msg.includes('user')) {
          setError('userId', { message: err.message });
          return;
        }
        if (msg.includes('categor')) {
          setError('categoryIds', { message: err.message });
          return;
        }
        setError('title', { message: err.message });
      }
    },
  });

  function toggleCategory(id: string) {
    const next = selectedCategoryIds.includes(id)
      ? selectedCategoryIds.filter((x) => x !== id)
      : [...selectedCategoryIds, id];
    setValue('categoryIds', next, { shouldValidate: true });
  }

  return (
    <form
      onSubmit={handleSubmit((data) =>
        mutate({
          title: data.title,
          description: data.description?.trim() || undefined,
          userId: data.userId,
          categoryIds: data.categoryIds?.length ? data.categoryIds : undefined,
        }),
      )}
      style={{
        marginBottom: 24,
        padding: 12,
        border: '1px solid #ccc',
      }}
    >
      <h2 style={{ marginTop: 0 }}>Create todo</h2>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>User</label>
        <select {...register('userId')} style={{ padding: 8, minWidth: 240 }}>
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.displayName} ({u.email})
            </option>
          ))}
        </select>
        {errors.userId && (
          <p style={{ color: 'red', margin: '4px 0 0', fontSize: 13 }}>
            {errors.userId.message}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Title</label>
        <input
          {...register('title')}
          placeholder="Todo title"
          style={{ padding: 8, width: '100%', boxSizing: 'border-box' }}
        />
        {errors.title && (
          <p style={{ color: 'red', margin: '4px 0 0', fontSize: 13 }}>
            {errors.title.message}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>
          Description (optional)
        </label>
        <input
          {...register('description')}
          placeholder="Description"
          style={{ padding: 8, width: '100%', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>
          Categories (max 5)
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {categories.map((c) => (
            <label
              key={c.id}
              style={{ display: 'flex', gap: 4, alignItems: 'center' }}
            >
              <input
                type="checkbox"
                checked={selectedCategoryIds.includes(c.id)}
                disabled={
                  !selectedCategoryIds.includes(c.id) &&
                  selectedCategoryIds.length >= 5
                }
                onChange={() => toggleCategory(c.id)}
              />
              <span style={{ color: c.color }}>{c.name}</span>
            </label>
          ))}
        </div>
        {errors.categoryIds && (
          <p style={{ color: 'red', margin: '4px 0 0', fontSize: 13 }}>
            {errors.categoryIds.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting || isPending}>
        {isPending ? 'Saving...' : 'Create Todo'}
      </button>
    </form>
  );
}
