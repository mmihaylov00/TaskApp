import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { Authenticated } from '../auth/decorator/authenticated.decorator';
import { User } from '../user/user.entity';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { Roles } from '../auth/decorator/role.decorator';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { CreateProjectDto, ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';
import { BoardService } from './board.service';
import { PageParams } from '../decorator/page.decorator';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {
  }

  @Get()
  async list(@Authenticated() user: User, @PageParams() pageParams: PageRequestDto): Promise<void> {

  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Authenticated() user: User, @Body() data: CreateProjectDto): Promise<void> {
  }

  @Put()
  @Roles(Role.ADMIN)
  async update(@Authenticated() user: User): Promise<void> {
    //todo
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
  }
}
