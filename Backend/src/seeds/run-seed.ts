import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import { DataSource } from 'typeorm';
import { Todo } from '../todos/entities/todo.entity';
import { seedTodos } from './todos.seed';

loadEnv();

async function run() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Todo],
    synchronize: process.env.DB_SYNC === 'true',
  });

  await dataSource.initialize();
  console.log('Database connected.');

  try {
    await seedTodos(dataSource);
  } finally {
    await dataSource.destroy();
  }
}

run().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
