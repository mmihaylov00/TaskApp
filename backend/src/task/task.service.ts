import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import {
  CreateTaskDto,
  MoveTaskDto,
  TaskMovedDto,
  TaskRemovedDto,
} from 'taskapp-common/dist/src/dto/task.dto';
import { TaskAppError } from '../error/task-app.error';
import { Board } from '../database/entity/board.entity';
import { Stage } from '../database/entity/stage.entity';
import { Task } from '../database/entity/task.entity';
import { BoardService } from '../board/board.service';
import { ProjectService } from '../project/project.service';
import { User } from '../database/entity/user.entity';
import { Attachment } from '../database/entity/attachment.entity';
import sequelize, { Op } from 'sequelize';
import { UserProject } from '../database/entity/user-project.entity';
import { Project } from '../database/entity/project.entity';

@Injectable()
export class TaskService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly boardService: BoardService,
  ) {}

  async create(user: JwtUser, data: CreateTaskDto) {
    if (!data.boardId) {
      throw new TaskAppError('invalid_board_id', HttpStatus.BAD_REQUEST);
    }
    const board = await this.boardService.getBoard(data.boardId, user);

    const stage = board.stages.find((s) => s.id === data.stage);
    if (!stage) {
      throw new TaskAppError('invalid_stage', HttpStatus.BAD_REQUEST);
    }

    let assignee;
    if (data.assignee) {
      assignee = await User.findByPk(data.assignee);
      await this.projectService.checkAccess(board?.project, assignee);
    }

    const task = await Task.create({
      name: data.title,
      description: data.description,
      priority: data.priority,
      stageId: data.stage,
      author: user.id,
      assignee: data.assignee?.length ? data.assignee : undefined,
      deadline: data.deadline,
      projectId: board.projectId,
    });

    stage.tasksOrder.splice(0, 0, task.id);

    await Stage.update(
      { tasksOrder: stage.tasksOrder },
      { where: { id: stage.id } },
    );

    task.assignedTo = assignee;

    this.boardService.sendMessage(board.id, 'task-created', task.toDto());

    return task.toDto();
  }

  async find(search: string, user: JwtUser) {
    const tasks = await Task.findAll({
      where: {
        name: { [Op.substring]: search },
        deleted: null,
        completed: null,
      },
      limit: 5,
      include: [
        { model: Project, include: [{ model: User, where: { id: user.id } }] },
      ],
      attributes: ['id', 'name'],
      order: ['name'],
    });
    return tasks.map((t) => t.toDto());
  }

  async getStages(id: string, user: JwtUser) {
    const task = await Task.findByPk(id, {
      include: [Stage],
    });
    if (!task) {
      throw new TaskAppError('Task could not be found', HttpStatus.NOT_FOUND);
    }
    const board = await this.boardService.getBoard(task.stage.boardId, user);

    return board.stages.map((stage) => stage.toDto());
  }

  async get(id: string, user: JwtUser) {
    const task = await Task.findByPk(id, {
      include: [
        Stage,
        Attachment,
        { model: User, as: 'assignedTo' },
        { model: User, as: 'creator' },
        { model: User, as: 'updatedByUser' },
      ],
    });
    if (!task) {
      throw new TaskAppError('Task could not be found', HttpStatus.NOT_FOUND);
    }
    await this.boardService.getBoard(task.stage.boardId, user);

    return task;
  }

  async update(id: string, user: JwtUser, data: CreateTaskDto) {
    let task = await Task.findByPk(id, {
      include: [Attachment, { model: Stage }],
    });

    const board = await this.boardService.getBoard(task.stage.boardId, user);
    const stage = board.stages.find((s) => s.id === data.stage);
    if (!stage) {
      throw new TaskAppError('invalid_stage', HttpStatus.BAD_REQUEST);
    }

    await this.moveTask(task, board, stage);

    task.name = data.title;
    task.description = data.description;
    task.priority = data.priority || null;
    task.stageId = data.stage;
    task.assignee = data.assignee?.length ? data.assignee : null;
    task.deadline = data.deadline || null;
    task.updatedAt = new Date();
    task.updatedBy = user.id;

    await task.save();
    task = await Task.findByPk(id, {
      include: [
        Attachment,
        { model: User, as: 'assignedTo' },
        { model: User, as: 'creator' },
        { model: User, as: 'updatedByUser' },
      ],
    });

    this.boardService.sendMessage(board.id, 'task-updated', task.toDto());

    return task.toDto();
  }

  async move(id: string, user: JwtUser, data: MoveTaskDto) {
    const board = await this.boardService.getBoard(data.boardId, user);

    const stage = board.stages.find((s) => s.id === data.stageId);
    if (!stage) {
      throw new TaskAppError('invalid_stage', HttpStatus.BAD_REQUEST);
    }

    const task = await Task.findByPk(id);
    if (!task) {
      throw new TaskAppError('invalid_task', HttpStatus.BAD_REQUEST);
    }

    await this.moveTask(task, board, stage, data.index);

    const oldStageId = task.stageId;
    task.stageId = data.stageId;
    task.updatedAt = new Date();
    task.updatedBy = user.id;

    await task.save();

    this.boardService.sendMessage(board.id, 'task-moved', <TaskMovedDto>{
      taskId: task.id,
      newStageId: stage.id,
      index: data.index,
      oldStageId,
    });
  }

  async complete(id: string, user: JwtUser) {
    let task = await Task.findByPk(id, { include: [Stage] });
    if (!task) {
      throw new TaskAppError('invalid_task', HttpStatus.BAD_REQUEST);
    }

    const boardId = task.stage.boardId;

    await this.boardService.getBoard(boardId, user);

    task.completed = true;
    task.updatedAt = new Date();
    task.updatedBy = user.id;

    await task.save();

    await this.removeFromStage(task.stage, task.id);

    this.boardService.sendMessage(boardId, 'task-removed', <TaskRemovedDto>{
      taskId: task.id,
      stageId: task.stageId,
    });
  }

  async getAssigned(user: JwtUser) {
    const dbUser = await User.findByPk(user.id, {
      include: {
        model: Task,
        as: 'assignedTasks',
        include: [Attachment],
        where: { deleted: null, completed: null },
      },
      order: [['assignedTasks', 'deadline', 'ASC']],
    });

    return dbUser.assignedTasks.map((t) => t.toDto());
  }

  async delete(id: string, user: JwtUser) {
    let task = await Task.findByPk(id, { include: [Stage] });
    if (!task) {
      throw new TaskAppError('invalid_task', HttpStatus.BAD_REQUEST);
    }
    const boardId = task.stage.boardId;
    await this.boardService.getBoard(boardId, user);

    task.deleted = true;

    await task.save();

    await this.removeFromStage(task.stage, task.id);

    this.boardService.sendMessage(boardId, 'task-removed', <TaskRemovedDto>{
      taskId: task.id,
      stageId: task.stageId,
    });
  }

  async removeFromStage(stage: Stage, taskId: string) {
    const index = stage.tasksOrder.indexOf(taskId);
    if (index === -1) {
      return;
    }
    stage.tasksOrder.splice(index, 1);

    await stage.save();
  }

  private async moveTask(
    task: Task,
    board: Board,
    newStage: Stage,
    newIndex?: number,
  ) {
    const isSameStage = task.stageId === newStage.id;

    if (isSameStage) {
      if (!newIndex) {
        return;
      }
      const index = newStage.tasksOrder.findIndex((id) => id == task.id);
      if (index != -1) {
        newStage.tasksOrder.splice(index, 1);
      }
    }

    newStage.tasksOrder.splice(newIndex || 0, 0, task.id);

    if (!isSameStage) {
      const previousStage = board.stages.find((s) => s.id === task.stageId);
      const index = previousStage.tasksOrder.indexOf(task.id);
      if (index != -1) {
        previousStage.tasksOrder.splice(index, 1);

        await Stage.update(
          { tasksOrder: previousStage.tasksOrder },
          { where: { id: previousStage.id } },
        );
      }
    }

    await Stage.update(
      { tasksOrder: newStage.tasksOrder },
      { where: { id: newStage.id } },
    );
  }
}
