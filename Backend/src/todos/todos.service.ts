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

    const [data, total] = await this.todoRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });

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
    const todo = await this.findOneOrFail(id);
    todo.status = status;
    return this.todoRepository.save(todo);
  }

  async softDelete(id: string) {
    const todo = await this.findOneOrFail(id);
    return this.todoRepository.softRemove(todo);
  }

  async removeMany(ids: string[]): Promise<void> {
    await this.todoRepository.delete({ id: In(ids) });
  }

  private async findOneOrFail(id: string) {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with id "${id}" not found`);
    }
    return todo;
  }
}
