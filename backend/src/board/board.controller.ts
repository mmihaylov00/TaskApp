import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { User } from '../user/user.entity';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { Roles } from '../auth/decorator/role.decorator';
import { BoardService } from './board.service';
import { BoardDto, CreateBoardDto } from 'taskapp-common/dist/src/dto/board.dto';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {
  }

  @Get()
  async list(@Authenticated() user: User): Promise<BoardDto[]> {
    return this.boardService.list(user);
  }

  @Get('/project/:projectId')
  async listByProject(@Authenticated() user: User, @Param('projectId') projectId: string): Promise<BoardDto[]> {
    return this.boardService.list(user, projectId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  async create(@Authenticated() user: User, @Body() data: CreateBoardDto) {
    await this.boardService.create(user, data);
  }

  @Put('/:id')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Authenticated() user: User,
               @Param('id') id: string,
               @Body() data: CreateBoardDto) {
    await this.boardService.update(user, id, data)
  }

  @Delete('/:id')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Authenticated() user: User,
               @Param('id') id: string) {
    await this.boardService.delete(user, id);
  }
}
