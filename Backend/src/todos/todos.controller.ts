import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BulkIdsDto } from './dto/bulk-ids.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { GetTodosQueryDto } from './dto/get-todos.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { TodosService } from './todos.service';
import { TodoStatus } from './entities/todo.entity';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll(@Query() query: GetTodosQueryDto) {
    return this.todosService.findAllPaginated(query);
  }

  @Post()
  create(@Body() dto: CreateTodoDto) {
    dto.status = TodoStatus.PENDING;
    return this.todosService.create(dto);
  }

  @Post('bulk-delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async bulkDelete(@Body() dto: BulkIdsDto): Promise<void> {
    await this.todosService.removeMany(dto.ids);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.todosService.changeStatus(id, dto.status);
  }

  @Patch(':id/archive')
  archive(@Param('id', ParseUUIDPipe) id: string) {
    return this.todosService.softDelete(id);
  }
}
