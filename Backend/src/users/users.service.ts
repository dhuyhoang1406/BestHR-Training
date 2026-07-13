import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo, TodoStatus } from '../entities/todo.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async findAll() {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOneOrFail(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async findTodosForUser(userId: string, status?: TodoStatus) {
    await this.findOneOrFail(userId);

    const qb = this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.categories', 'category')
      .where('todo.userId = :userId', { userId })
      .andWhere('todo.deletedAt IS NULL')
      .orderBy('todo.createdAt', 'DESC');

    if (status) {
      qb.andWhere('todo.status = :status', { status });
    }

    return qb.getMany();
  }
}
