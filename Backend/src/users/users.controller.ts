import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { GetUserTodosQueryDto } from './dto/get-user-todos.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id/todos')
  getTodos(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetUserTodosQueryDto,
  ) {
    return this.usersService.findTodosForUser(id, query.status);
  }
}
