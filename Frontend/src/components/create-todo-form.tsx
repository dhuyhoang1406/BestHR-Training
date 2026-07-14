'use client';

import { useCreateTodoForm } from '@/hooks/use-create-todo-form';

export function CreateTodoForm() {
  const {
    users,
    categories,
    register,
    errors,
    isSubmitting,
    isPending,
    selectedCategoryIds,
    toggleCategory,
    submit,
  } = useCreateTodoForm();

  return (
    <form
      onSubmit={submit}
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
