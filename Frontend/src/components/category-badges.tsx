import type { Category } from '@/lib/types';

export function CategoryBadges({ categories }: { categories?: Category[] }) {
  if (!categories?.length) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
      {categories.map((c) => (
        <span
          key={c.id}
          style={{
            backgroundColor: c.color || '#94a3b8',
            color: '#fff',
            fontSize: 11,
            padding: '2px 6px',
          }}
        >
          {c.name}
        </span>
      ))}
    </div>
  );
}
