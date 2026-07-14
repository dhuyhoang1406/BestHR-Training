'use client';

import Link from 'next/link';

export function AppNav() {
  return (
    <nav
      style={{
        display: 'flex',
        gap: 16,
        marginBottom: 24,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <Link href="/">Todos</Link>
      <Link href="/archive">Archive</Link>
      <Link href="/categories">Categories</Link>
      <Link href="/users">Users</Link>
    </nav>
  );
}
