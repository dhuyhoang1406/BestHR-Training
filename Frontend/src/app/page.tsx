import { AppNav } from '@/components/app-nav';
import { TodoFeed } from '@/components/todo-feed';
import { fetchTodos } from '@/lib/api';

type HomePageProps = {
  searchParams: Promise<{ isArchived?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const isArchived = params.isArchived === 'true';

  let initialData;

  try {
    initialData = await fetchTodos(1, 5, isArchived);
  } catch {
    initialData = undefined;
  }

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <AppNav />
      <h1>{isArchived ? 'Archive' : 'Todos'}</h1>
      <TodoFeed
        key={isArchived ? 'archived' : 'active'}
        initialData={initialData}
        isArchived={isArchived}
      />
    </main>
  );
}
