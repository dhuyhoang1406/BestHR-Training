import { DataSource } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { Todo, TodoStatus } from '../../entities/todo.entity';
import { User } from '../../entities/user.entity';

const SAMPLE_COUNT = 24;

const CATEGORY_SEEDS = [
  { name: 'Work', color: '#3b82f6' },
  { name: 'Personal', color: '#22c55e' },
  { name: 'Urgent', color: '#ef4444' },
  { name: 'Learning', color: '#a855f7' },
];

export async function seedTodos(dataSource: DataSource): Promise<number> {
  const userRepository = dataSource.getRepository(User);
  const categoryRepository = dataSource.getRepository(Category);
  const todoRepository = dataSource.getRepository(Todo);

  let user = await userRepository.findOne({
    where: { email: 'demo@besthr.local' },
  });

  if (!user) {
    user = await userRepository.save(
      userRepository.create({
        email: 'demo@besthr.local',
        displayName: 'Demo User',
      }),
    );
    console.log(`Seeded user ${user.email} (${user.id})`);
  }

  let categories = await categoryRepository.find();
  if (categories.length === 0) {
    categories = await categoryRepository.save(
      CATEGORY_SEEDS.map((item) => categoryRepository.create(item)),
    );
    console.log(`Seeded ${categories.length} categories.`);
  }

  const existingTodos = await todoRepository.count();
  if (existingTodos > 0) {
    console.log(`Skip todos seed: table already has ${existingTodos} row(s).`);
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
      userId: user.id,
      categories: [categories[n % categories.length]],
    });
  });

  await todoRepository.save(samples);
  console.log(`Seeded ${samples.length} todos for user ${user.id}.`);
  return samples.length;
}
