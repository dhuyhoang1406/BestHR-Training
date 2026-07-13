import { AppNav } from '@/components/app-nav';
import { DetailToDo } from '@/components/detail-to-do';

export default function TodoDetailPage() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <AppNav />
      <DetailToDo />
    </main>
  );
}
