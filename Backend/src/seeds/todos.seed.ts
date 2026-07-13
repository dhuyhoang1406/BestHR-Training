import { DataSource } from 'typeorm';
import { Todo, TodoStatus } from '../todos/entities/todo.entity';

const SAMPLE_COUNT = 24;

export async function seedTodos(dataSource: DataSource): Promise<number> {
  const todoRepository = dataSource.getRepository(Todo);
  const existing = await todoRepository.count();

  if (existing > 0) {
    console.log(`Skip todos seed: table already has ${existing} row(s).`);
    return 0;
  }

  const samples = Array.from({ length: SAMPLE_COUNT }, (_, index) => {
    const n = index + 1;
    return todoRepository.create({
      title: `Todo item #${n}`,
      description: `Sample todo for pagination demo (${n})`,
      status:
        n % 3 === 0
          ? TodoStatus.DONE
          : n % 2 === 0
            ? TodoStatus.IN_PROGRESS
            : TodoStatus.PENDING,
    });
  });

  await todoRepository.save(samples);
  console.log(`Seeded ${samples.length} todos.`);
  return samples.length;
}
