import { TodoFeed } from '@/components/todo-feed';

export default function HomePage() {
  return (
    <>
      <h1>Todos</h1>
      <TodoFeed isArchived={false} />
    </>
  );
}
