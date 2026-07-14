import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiError } from '@/lib/api-error';
import {
  createCategorySchema,
  type CreateCategoryInput,
} from '@/lib/schemas/category.schema';
import { useCreateCategory } from './mutations';

const DEFAULT_COLOR = '#3b82f6';

export function useCreateCategoryForm() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      color: DEFAULT_COLOR,
    },
  });

  const color = watch('color');

  const createMutation = useCreateCategory({
    onSuccess: async () => {
      reset({ name: '', color: DEFAULT_COLOR });
    },
    onError: (err: unknown) => {
      if (!(err instanceof ApiError)) return;

      const msg = err.message.toLowerCase();
      if (msg.includes('color')) {
        setError('color', { message: err.message });
        return;
      }
      if (msg.includes('exist') || msg.includes('name')) {
        setError('name', { message: err.message });
        return;
      }
      setError('name', { message: err.message });
    },
  });

  function setColor(nextColor: string) {
    setValue('color', nextColor.toLowerCase(), { shouldValidate: true });
  }

  function onSubmit(data: CreateCategoryInput) {
    createMutation.mutate({
      name: data.name.trim(),
      color: data.color.toLowerCase(),
    });
  }

  return {
    register,
    errors,
    isSubmitting,
    isPending: createMutation.isPending,
    color,
    setColor,
    submit: handleSubmit(onSubmit),
  };
}
