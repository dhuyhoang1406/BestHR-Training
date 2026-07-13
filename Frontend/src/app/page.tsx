import { TodoFeed } from '@/components/todo-feed';
import { fetchTodos } from '@/lib/api';

export default async function HomePage() {
  let initialData;

  try {
    initialData = await fetchTodos(1, 5);
  } catch {
    initialData = undefined;
  }

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>Todos</h1>
      <TodoFeed initialData={initialData} />
    </main>
  );
}
