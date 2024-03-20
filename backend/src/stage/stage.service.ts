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

  async getStage(id: string, user?: JwtUser) {
    const stage = await Stage.findByPk(id, {
      include: { model: Board, include: [{ model: Project, include: [User] }] },
    });
    await this.projectService.checkAccess(stage?.board?.project, user);

    return stage;
  }
}
