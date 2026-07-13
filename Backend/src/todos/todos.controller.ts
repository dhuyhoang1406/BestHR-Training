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

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll(@Query() query: GetTodosQueryDto) {
    return this.todosService.findAllPaginated(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTodoDto) {
    return this.todosService.createWithCategories(dto);
  }

  @Post('bulk-delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  async bulkDelete(@Body() dto: BulkIdsDto): Promise<void> {
    await this.todosService.removeMany(dto.ids);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.todosService.findOneOrFail(id, true);
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

  @Patch(':id/restore')
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.todosService.restore(id);
  }
}
