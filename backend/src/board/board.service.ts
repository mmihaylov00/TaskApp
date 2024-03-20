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
import { Stage } from '../database/entity/stage.entity';
import { Task } from '../database/entity/task.entity';
import { Socket } from 'socket.io';

@Injectable()
export class BoardService {
  static boards: { [boardId: string]: Set<Socket> } = {};

  constructor(private readonly projectService: ProjectService) {}

  async list(user: JwtUser, projectId?: string) {
    const projectWhere = projectId ? { id: projectId } : undefined;
    const projectInclude = { model: Project, where: projectWhere };
    const stageInclude = { model: Stage };
    const include: any[] = [projectInclude, stageInclude];

    if (user.role !== Role.ADMIN) {
      include.push({ model: User, where: { id: user.id } });
    }

    const boards = await Board.findAll({
      where: { archived: false },
      include,
      order: ['name'],
    });

    return boards.map((board) => board.toDto());
  }

  async create(user: JwtUser, data: CreateBoardDto) {
    const project = await this.projectService.getProject(data.projectId, user);

    try {
      const board = await Board.create({ ...data, project });

      const stages = await Stage.bulkCreate(
        data.stages.map((stage) => {
          return { name: stage.name, color: stage.color, boardId: board.id };
        }),
      );

      board.stagesOrder = stages.map((stage) => stage.id);

      await board.save();

      return board.toDto();
    } catch (_) {
      throw new TaskAppError('board_creation_failed', HttpStatus.BAD_REQUEST);
    }
  }

  async update(user: JwtUser, id: string, data: UpdateBoardDto) {
    const board = await this.getBoard(id, user);
    board.color = data.color;
    board.name = data.name;

    let newStages = [];

    for (let stage of data.stages) {
      if (!stage.id) {
        const dbStage = await Stage.create({
          name: stage.name,
          color: stage.color,
          boardId: board.id,
        });
        stage.id = dbStage.id;
        newStages.push(stage);
      } else {
        const dbStage = board.stages.find((s) => s.id === stage.id);
        if (dbStage.color !== stage.color || dbStage.name !== stage.name) {
          dbStage.color = stage.color;
          dbStage.name = stage.name;
          await dbStage.save();
        }
        newStages.push(dbStage);
      }
    }

    board.stagesOrder = newStages.map((stage) => stage.id);

    //todo when the stage is deleted, move the tasks to another stage and mark it as deleted

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

  async getBoard(id: string, user?: JwtUser, includeTasks = false) {
    const board = await Board.findOne({
      where: { id },
      include: [
        { model: Project, include: [User] },
        {
          model: Stage,
          include: includeTasks
            ? [
                {
                  model: Task,
                  include: [
                    {
                      model: User,
                      as: 'assignedTo',
                      attributes: ['id', 'firstName', 'lastName'],
                    },
                  ],
                  attributes: ['id', 'name', 'priority', 'stageId', 'deadline'],
                },
              ]
            : [],
        },
      ],
    });
    await this.projectService.checkAccess(board?.project, user);

    return board;
  }

  sendMessage(boardId: string, event: string, data: any) {
    const board = BoardService.boards[boardId];
    if (!board) return;
    for (const client of board) {
      client.emit(event, data);
    }
  }
}
