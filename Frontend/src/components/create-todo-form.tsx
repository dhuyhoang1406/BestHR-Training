'use client';

import { useCreateTodoForm } from '@/hooks/use-create-todo-form';

type CreateTodoFormProps = {
  userId: string;
};

export function CreateTodoForm({ userId }: CreateTodoFormProps) {
  const {
    categories,
    register,
    errors,
    isSubmitting,
    isPending,
    selectedCategoryIds,
    toggleCategory,
    submit,
  } = useCreateTodoForm(userId);

  return (
    <form
      onSubmit={submit}
      style={{
        marginBottom: 24,
        padding: 12,
        border: '1px solid #ccc',
      }}
    >
      <input type="hidden" {...register('userId')} />

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
