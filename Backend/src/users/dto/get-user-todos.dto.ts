import { IsEnum, IsOptional } from 'class-validator';
import { TodoStatus } from '../../entities/todo.entity';

export class GetUserTodosQueryDto {
  @IsOptional()
  @IsEnum(TodoStatus)
  status?: TodoStatus;
}
