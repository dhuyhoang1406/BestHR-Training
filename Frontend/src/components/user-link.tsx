'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

type UserLinkProps = {
  userId: string;
  children: ReactNode;
  style?: React.CSSProperties;
};

export function UserLink({ userId, children, style }: UserLinkProps) {
  return (
    <Link href={`/users/${userId}`} style={style}>
      {children}
    </Link>
  );
}
