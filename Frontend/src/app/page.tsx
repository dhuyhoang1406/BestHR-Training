import { AppNav } from '@/components/app-nav';
import { CreateTodoForm } from '@/components/create-todo-form';
import { TodoFeed } from '@/components/todo-feed';

type HomePageProps = {
  searchParams: Promise<{ isArchived?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const isArchived = params.isArchived === 'true';

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <AppNav />
      <h1>{isArchived ? 'Archive' : 'Todos'}</h1>
      {!isArchived && <CreateTodoForm />}
      <TodoFeed
        key={isArchived ? 'archived' : 'active'}
        isArchived={isArchived}
      />
    </main>
  );
}
