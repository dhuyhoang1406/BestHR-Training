import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAll() {
    return this.categoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const name = dto.name.trim();
    const color = dto.color.toLowerCase();

    const existing = await this.categoryRepository.findOne({
      where: { name },
    });
    if (existing) {
      throw new ConflictException(`Category "${name}" already exists`);
    }

    const category = this.categoryRepository.create({ name, color });
    return this.categoryRepository.save(category);
  }
}
