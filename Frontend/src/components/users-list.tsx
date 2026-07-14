'use client';

import Link from 'next/link';
import { useUsers } from '@/hooks/queries';

export function UsersList() {
  const { data: users = [], isLoading, isError, error } = useUsers();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p style={{ color: 'red' }}>{(error as Error).message}</p>;

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {users.map((user) => (
        <li
          key={user.id}
          style={{
            border: '1px solid #ccc',
            padding: 12,
            marginBottom: 8,
          }}
        >
          <Link
            href={`/users/${user.id}`}
            style={{ fontWeight: 600, color: 'inherit' }}
          >
            {user.displayName}
          </Link>
          <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
            {user.email}
          </div>
        </li>
      ))}
      {users.length === 0 && <p>No users found.</p>}
    </ul>
  );
}
