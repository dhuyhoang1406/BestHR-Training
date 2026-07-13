import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { User } from '../entities/user.entity';
import { Todo } from '../entities/todo.entity';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, User, Category])],
  controllers: [TodosController],
  providers: [TodosService],
  exports: [TodosService],
})
export class TodosModule {}
