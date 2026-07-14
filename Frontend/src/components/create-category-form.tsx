'use client';

import { useCreateCategoryForm } from '@/hooks/use-create-category-form';

function hexToRgb(hex: string): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) return '';
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return '';
  return `rgb(${r}, ${g}, ${b})`;
}

export function CreateCategoryForm() {
  const {
    register,
    errors,
    isSubmitting,
    isPending,
    color,
    setColor,
    submit,
  } = useCreateCategoryForm();

  return (
    <form
      onSubmit={submit}
      style={{
        marginBottom: 24,
        padding: 12,
        border: '1px solid #ccc',
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Name</label>
        <input
          {...register('name')}
          placeholder="Category name"
          style={{ padding: 8, width: '100%', boxSizing: 'border-box' }}
        />
        {errors.name && (
          <p style={{ color: 'red', margin: '4px 0 0', fontSize: 13 }}>
            {errors.name.message}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>
          Color (RGB palette)
        </label>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="color"
            value={/^#[0-9A-Fa-f]{6}$/.test(color) ? color : '#3b82f6'}
            onChange={(e) => setColor(e.target.value)}
            title="Pick a color"
            style={{
              width: 48,
              height: 40,
              padding: 0,
              border: '1px solid #ccc',
              cursor: 'pointer',
              background: 'transparent',
            }}
          />
          <input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            onBlur={register('color').onBlur}
            name="color"
            placeholder="#3b82f6"
            style={{ padding: 8, fontFamily: 'monospace', width: 120 }}
          />
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 4,
              backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(color)
                ? color
                : '#ccc',
              border: '1px solid #ccc',
              flexShrink: 0,
            }}
            title={color}
          />
          <span style={{ fontSize: 13, color: '#555', fontFamily: 'monospace' }}>
            {hexToRgb(color) || '—'}
          </span>
        </div>
        {errors.color && (
          <p style={{ color: 'red', margin: '4px 0 0', fontSize: 13 }}>
            {errors.color.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting || isPending}>
        {isPending ? 'Saving...' : 'Create Category'}
      </button>
    </form>
  );
}
