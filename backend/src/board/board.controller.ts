import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { Roles } from '../auth/decorator/role.decorator';
import { BoardService } from './board.service';
import { CreateBoardDto } from 'taskapp-common/dist/src/dto/board.dto';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller('boards')
@UseGuards(JwtGuard)
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  async list(@Authenticated() user: JwtUser) {
    return this.boardService.list(user);
  }

  @Get('/:id')
  async get(@Authenticated() user: JwtUser, @Param('id') id: string) {
    const board = await this.boardService.getBoard(id, user, true);
    return board.toDto();
  }

  @Get('/project/:projectId')
  async listByProject(
    @Authenticated() user: JwtUser,
    @Param('projectId') projectId: string,
  ) {
    return this.boardService.list(user, projectId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @HttpCode(HttpStatus.CREATED)
  async create(@Authenticated() user: JwtUser, @Body() data: CreateBoardDto) {
    return this.boardService.create(user, data);
  }

  @Put('/:id')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Authenticated() user: JwtUser,
    @Param('id') id: string,
    @Body() data: CreateBoardDto,
  ) {
    await this.boardService.update(user, id, data);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Authenticated() user: JwtUser, @Param('id') id: string) {
    await this.boardService.delete(user, id);
  }
}
