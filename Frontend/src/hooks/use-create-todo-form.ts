import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiError } from '@/lib/api-error';
import {
  createTodoSchema,
  type CreateTodoInput,
} from '@/lib/schemas/todo.schema';
import { useCreateTodo } from './mutations';
import { useCategories } from './queries';

export function useCreateTodoForm(userId: string) {
  const { data: categories = [] } = useCategories();

  const form = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      userId,
      categoryIds: [],
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const selectedCategoryIds = watch('categoryIds') ?? [];

  useEffect(() => {
    setValue('userId', userId, { shouldValidate: false });
  }, [userId, setValue]);

  const createMutation = useCreateTodo({
    onSuccess: async () => {
      reset({
        title: '',
        description: '',
        userId,
        categoryIds: [],
      });
    },
    onError: (err: unknown) => {
      if (!(err instanceof ApiError)) return;

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
    },
  });

  function toggleCategory(id: string) {
    const next = selectedCategoryIds.includes(id)
      ? selectedCategoryIds.filter((x) => x !== id)
      : [...selectedCategoryIds, id];
    setValue('categoryIds', next, { shouldValidate: true });
  }

  function onSubmit(data: CreateTodoInput) {
    createMutation.mutate({
      title: data.title,
      description: data.description?.trim() || undefined,
      userId: data.userId,
      categoryIds: data.categoryIds?.length ? data.categoryIds : undefined,
    });
  }

  return {
    categories,
    register,
    errors,
    isSubmitting,
    isPending: createMutation.isPending,
    selectedCategoryIds,
    toggleCategory,
    submit: handleSubmit(onSubmit),
  };
}
