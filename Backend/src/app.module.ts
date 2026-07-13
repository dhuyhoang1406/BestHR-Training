import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './caterogies/categories.module';
import { Category } from './entities/category.entity';
import databaseConfig from './config/database.config';
import { Todo } from './entities/todo.entity';
import { TodosModule } from './todos/todos.module';
import { User } from './entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.getOrThrow<string>('database.host'),
        port: config.getOrThrow<number>('database.port'),
        username: config.getOrThrow<string>('database.username'),
        password: config.getOrThrow<string>('database.password'),
        database: config.getOrThrow<string>('database.database'),
        entities: [User, Category, Todo],
        autoLoadEntities: true,
        synchronize: config.get<boolean>('database.synchronize') ?? false,
      }),
    }),
    UsersModule,
    CategoriesModule,
    TodosModule,
  ],
})
export class AppModule {}
