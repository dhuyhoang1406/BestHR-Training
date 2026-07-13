import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { TodoStatus } from '../entities/todo.entity';

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}
