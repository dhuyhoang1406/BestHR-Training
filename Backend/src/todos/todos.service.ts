import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository, SelectQueryBuilder } from 'typeorm';
import { Category } from '../entities/category.entity';
import { User } from '../entities/user.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodosQueryDto } from './dto/get-todos.dto';
import { Todo, TodoStatus } from '../entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    private readonly dataSource: DataSource,
  ) {}

  findAllPaginated(query: GetTodosQueryDto) {
    const qb = this.createListQuery(query).where('todo.deletedAt IS NULL');
    return this.paginate(qb, query);
  }

  findAllArchivedPaginated(query: GetTodosQueryDto) {
    const qb = this.createListQuery(query)
      .withDeleted()
      .where('todo.deletedAt IS NOT NULL');
    return this.paginate(qb, query);
  }

  private createListQuery(query: GetTodosQueryDto): SelectQueryBuilder<Todo> {
    const qb = this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.categories', 'category')
      .leftJoinAndSelect('todo.user', 'user')
      .orderBy('todo.createdAt', 'DESC');

    const search = query.search?.trim();
    if (search) {
      qb.andWhere(
        '(todo.title ILIKE :search OR todo.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return qb;
  }

  private async paginate(qb: SelectQueryBuilder<Todo>, query: GetTodosQueryDto) {
    const limit = query.limit ?? 5;
    const page = query.page ?? 1;

    const [data, total] = await qb
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

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

  async createWithCategories(dto: CreateTodoDto): Promise<Todo> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const todoRepo = queryRunner.manager.getRepository(Todo);
      const categoryRepo = queryRunner.manager.getRepository(Category);
      const userRepo = queryRunner.manager.getRepository(User);

      const user = await userRepo.findOneBy({ id: dto.userId });
      if (!user) {
        throw new NotFoundException(`User ${dto.userId} not found`);
      }

      let categories: Category[] = [];
      if (dto.categoryIds?.length) {
        categories = await categoryRepo.findBy({ id: In(dto.categoryIds) });
        if (categories.length !== dto.categoryIds.length) {
          throw new NotFoundException('One or more categories do not exist');
        }
      }

      const todo = todoRepo.create({
        title: dto.title,
        description: dto.description ?? null,
        status: TodoStatus.PENDING,
        userId: dto.userId,
        categories,
      });

      const saved = await todoRepo.save(todo);
      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async changeStatus(id: string, status: TodoStatus) {
    const todo = await this.findOneOrFail(id, true);
    if (todo.deletedAt) {
      throw new BadRequestException(
        'Cannot change status of an archived todo. Restore it first.',
      );
    }
    todo.status = status;
    return this.todoRepository.save(todo);
  }

  async softDelete(id: string) {
    const todo = await this.findOneOrFail(id);
    await this.todoRepository.softDelete(id);
    return this.findOneOrFail(id, true);
  }

  async restore(id: string) {
    const todo = await this.findOneOrFail(id, true);
    if (!todo.deletedAt) {
      return todo;
    }
    await this.todoRepository.restore(id);
    return this.findOneOrFail(id);
  }

  async removeMany(ids: string[]): Promise<void> {
    await this.todoRepository.delete({ id: In(ids) });
  }

  async findOneOrFail(id: string, withDeleted = false) {
    const todo = await this.todoRepository.findOne({
      where: { id },
      withDeleted,
      relations: { categories: true, user: true },
    });
    if (!todo) {
      throw new NotFoundException(`Todo with id "${id}" not found`);
    }
    return todo;
  }
}
