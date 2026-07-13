import Link from 'next/link';

export function AppNav() {
  return (
    <nav style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
      <Link href="/">Active</Link>
      <Link href="/?isArchived=true">Archive</Link>
    </nav>
  );
}
