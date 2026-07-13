import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodosQueryDto } from './dto/get-todos.dto';
import { Todo, TodoStatus } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async findAllPaginated(query: GetTodosQueryDto) {
    const limit = query.limit ?? 5;
    const page = query.page ?? 1;
    const isArchived = query.isArchived === true;

    // QueryBuilder avoids TypeORM soft-delete + findAndCount edge cases
    const qb = this.todoRepository
      .createQueryBuilder('todo')
      .withDeleted()
      .orderBy('todo.createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit);

    if (isArchived) {
      qb.where('todo.deletedAt IS NOT NULL');
    } else {
      qb.where('todo.deletedAt IS NULL');
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async create(dto: CreateTodoDto) {
    const todo = this.todoRepository.create(dto);
    return this.todoRepository.save(todo);
  }

  async changeStatus(id: string, status: TodoStatus) {
    const todo = await this.findOneOrFail(id, true);
    todo.status = status;
    return this.todoRepository.save(todo);
  }

  async softDelete(id: string) {
    const todo = await this.findOneOrFail(id);
    return this.todoRepository.softRemove(todo);
  }

  async restore(id: string) {
    const todo = await this.findOneOrFail(id, true);
    if (!todo.deletedAt) {
      return todo;
    }
    return this.todoRepository.recover(todo);
  }

  async removeMany(ids: string[]): Promise<void> {
    await this.todoRepository.delete({ id: In(ids) });
  }

  async findOneOrFail(id: string, withDeleted = false) {
    const todo = await this.todoRepository.findOne({
      where: { id },
      withDeleted,
    });
    if (!todo) {
      throw new NotFoundException(`Todo with id "${id}" not found`);
    }
    return todo;
  }
}
