'use client';

import Link from 'next/link';
import { useUsers } from '@/hooks/use-users';

export function AppNav() {
  const { data: users = [] } = useUsers();
  const firstUserId = users[0]?.id;

  return (
    <nav style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
      <Link href="/">Active</Link>
      <Link href="/?isArchived=true">Archive</Link>
      {firstUserId ? (
        <Link href={`/users/${firstUserId}`}>User todos</Link>
      ) : (
        <span style={{ color: '#999' }}>User todos</span>
      )}
    </nav>
  );
}
