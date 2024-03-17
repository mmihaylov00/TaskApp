import { HttpStatus, Injectable } from '@nestjs/common';
import { Stage } from '../database/entity/stage.entity';
import { BoardService } from '../board/board.service';
import {
  ManageStageDto,
  StageDto,
} from 'taskapp-common/dist/src/dto/stage.dto';
import { TaskAppError } from '../error/task-app.error';
import { ProjectService } from '../project/project.service';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import { Board } from '../database/entity/board.entity';
import { Task } from '../database/entity/task.entity';
import { Project } from '../database/entity/project.entity';
import { User } from '../database/entity/user.entity';
import { TaskDto } from 'taskapp-common/dist/src/dto/task.dto';

@Injectable()
export class StageService {
  constructor(
    private readonly boardService: BoardService,
    private readonly projectService: ProjectService,
  ) {}

  async list(user: JwtUser, boardId: string) {
    const board = await Board.findOne({
      where: { id: boardId },
      include: { model: Stage, include: [Task] },
    });
    return board.stages.map((stage) => stage.toDto());
  }

  async create(user: JwtUser, data: ManageStageDto) {
    const board = await this.boardService.getBoard(data.boardId, user);

    try {
      await Project.create({ ...data, board });
    } catch (_) {
      throw new TaskAppError('stage_creation_failed', HttpStatus.BAD_REQUEST);
    }
  }

  async update(user: JwtUser, id: string, data: ManageStageDto) {
    const stage = await this.getStage(id, user);
    stage.name = data.name;
    stage.color = data.color;

    try {
      await stage.save();
    } catch (_) {
      throw new TaskAppError('stage_update_failed', HttpStatus.CONFLICT);
    }
  }

  async delete(user: JwtUser, id: string) {
    const stage = await this.getStage(id, user);

    try {
      await stage.destroy();
    } catch (_) {
      throw new TaskAppError('stage_not_deleted', HttpStatus.BAD_REQUEST);
    }
  }

  async getStage(id: string, user?: JwtUser) {
    const stage = await Stage.findByPk(id, {
      include: { model: Board, include: [{ model: Project, include: [User] }] },
    });
    await this.projectService.checkAccess(stage?.board?.project, user);

    return stage;
  }
}
