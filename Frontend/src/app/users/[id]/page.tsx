import { AppNav } from '@/components/app-nav';
import { UserTodosPanel } from '@/components/user-todos-panel';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserTodosPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <AppNav />
      <h1>User todos</h1>
      <UserTodosPanel userId={id} />
    </main>
  );
}
