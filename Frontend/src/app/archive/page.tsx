import { TodoFeed } from '@/components/todo-feed';

export default function ArchivePage() {
  return (
    <>
      <h1>Archive</h1>
      <TodoFeed isArchived />
    </>
  );
}
