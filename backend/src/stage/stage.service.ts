import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stage } from './stage.entity';
import { User } from '../user/user.entity';
import { BoardService } from '../board/board.service';
import { ManageStageDto } from 'taskapp-common/dist/src/dto/stage.dto';
import { TaskAppError } from '../error/task-app.error';
import { ProjectService } from '../project/project.service';
import { JwtUser } from '../auth/decorator/jwt-user.dto';

@Injectable()
export class StageService {
  constructor(
    @InjectRepository(Stage)
    private readonly repository: Repository<Stage>,
    private readonly boardService: BoardService,
    private readonly projectService: ProjectService,
  ) {}

  async list(user: JwtUser, boardId: string) {
    const board = await this.boardService.getBoard(boardId, user);
    const stages = await this.repository.findBy({
      deleted: false,
      board: {
        id: board.id,
      },
    });
    //todo load tasks into stage
    return stages.map((stage) => {
      return { ...stage, tasks: [] };
    });
  }

  async create(user: JwtUser, data: ManageStageDto) {
    const board = await this.boardService.getBoard(data.boardId, user);
    try {
      await this.repository.insert({ ...data, board });
    } catch (_) {
      throw new TaskAppError('stage_creation_failed', HttpStatus.BAD_REQUEST);
    }
  }

  async update(user: JwtUser, id: string, data: ManageStageDto) {
    const stage = await this.getStage(id, user);
    stage.name = data.name;
    stage.color = data.color;

    try {
      await this.repository.save(stage);
    } catch (_) {
      throw new TaskAppError('stage_update_failed', HttpStatus.CONFLICT);
    }
  }

  async delete(user: JwtUser, id: string) {
    const stage = await this.getStage(id, user);
    stage.delete();

    try {
      await this.repository.save(stage);
    } catch (_) {
      throw new TaskAppError('stage_not_deleted', HttpStatus.BAD_REQUEST);
    }
  }
  async getStage(id: string, user?: JwtUser) {
    const stage = await this.repository.findOneBy({ id, deleted: false });
    this.projectService.checkAccess(stage?.board?.project, user);

    return stage;
  }
}
