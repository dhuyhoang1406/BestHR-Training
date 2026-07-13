import { IsEnum } from 'class-validator';
import { TodoStatus } from '../entities/todo.entity';

export class UpdateStatusDto {
  @IsEnum(TodoStatus)
  status: TodoStatus;
}
