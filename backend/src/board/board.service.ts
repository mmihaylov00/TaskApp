import { HttpStatus, Injectable } from '@nestjs/common';
import { Board } from '../database/entity/board.entity';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { ProjectService } from '../project/project.service';
import {
  CreateBoardDto,
  UpdateBoardDto,
} from 'taskapp-common/dist/src/dto/board.dto';
import { TaskAppError } from '../error/task-app.error';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import { Project } from '../database/entity/project.entity';
import { User } from '../database/entity/user.entity';

@Injectable()
export class BoardService {
  constructor(private readonly projectService: ProjectService) {}

  async list(user: JwtUser, projectId?: string) {
    const projectWhere = projectId ? { id: projectId } : undefined;
    const projectInclude = { model: Project, where: projectWhere };
    const userInclude = { model: User, where: { id: user.id } };
    const include =
      user.role !== Role.ADMIN
        ? [projectInclude, userInclude]
        : [projectInclude];

    return Board.findAll({
      where: { archived: false },
      include,
      order: ['name'],
    });
  }

  async create(user: JwtUser, data: CreateBoardDto) {
    const project = await this.projectService.getProject(data.projectId, user);

    try {
      const board = await Board.create({ ...data, project });
      return board.toDto();
    } catch (_) {
      throw new TaskAppError('board_creation_failed', HttpStatus.BAD_REQUEST);
    }
  }

  async update(user: JwtUser, id: string, data: UpdateBoardDto) {
    const board = await this.getBoard(id, user);
    board.color = data.color;
    board.name = data.name;

    try {
      await board.save();
    } catch (_) {
      throw new TaskAppError('board_update_failed', HttpStatus.CONFLICT);
    }
  }

  async delete(user: JwtUser, id: string) {
    const board = await this.getBoard(id, user);

    board.archived = true;

    try {
      await board.save();
    } catch (_) {
      throw new TaskAppError('board_not_deleted', HttpStatus.BAD_REQUEST);
    }
  }

  async getBoard(id: string, user?: JwtUser) {
    const board = await Board.findOne({
      where: { id },
      include: { model: Project, include: [User] },
    });
    await this.projectService.checkAccess(board?.project, user);

    return board;
  }
}
