import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../database/entity/user.entity';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import {
  CreateProjectDto,
  ProjectDto,
  ProjectStatsDto,
} from 'taskapp-common/dist/src/dto/project.dto';
import { TaskAppError } from '../error/task-app.error';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import { Project } from '../database/entity/project.entity';
import { Board } from '../database/entity/board.entity';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { UserProject } from '../database/entity/user-project.entity';
import { Stage } from '../database/entity/stage.entity';
import { Task } from '../database/entity/task.entity';
import { QueryTypes } from 'sequelize';

@Injectable()
export class ProjectService {
  constructor() {}

  async list(user: JwtUser, page: PageRequestDto) {
    //todo don't select archived boards
    const include =
      user.role !== Role.ADMIN
        ? [
            Board,
            {
              model: User,
              where: {
                id: user.id,
              },
            },
          ]
        : [Board];

    const { count, rows } = await Project.findAndCountAll(
      Page.paged(
        {
          include,
          order: ['name'],
        },
        page,
      ),
    );

    return Page.getPageData<Project, ProjectDto>(
      rows,
      page,
      count,
      (projects) => projects.toDto(),
    );
  }

  async create(user: JwtUser, data: CreateProjectDto): Promise<ProjectDto> {
    try {
      const dbUser = await User.findByPk(user.id);

      const project = await Project.create({ ...data });

      await UserProject.create({ userId: dbUser.id, projectId: project.id });

      const userProjects: any[] = data.userIds.map(
        (id) => <UserProject>{ userId: id, projectId: project.id },
      );
      await UserProject.bulkCreate(userProjects);

      return { ...data, id: project.id, boards: [] };
    } catch (e) {
      throw new TaskAppError('project_not_created', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, data: CreateProjectDto) {
    try {
      await Project.update(
        { name: data.name, color: data.color, icon: data.icon },
        { where: { id } },
      );
    } catch (_) {
      throw new TaskAppError('project_not_created', HttpStatus.BAD_REQUEST);
    }
  }

  async delete(id: string) {
    const project = await this.getProject(id);
    try {
      await project.destroy();
    } catch (_) {
      throw new TaskAppError('project_not_deleted', HttpStatus.BAD_REQUEST);
    }
  }

  async listProjects(id: string) {
    const projects = await Project.findAll({
      include: { model: User, where: { id } },
    });
    return projects.map((project) => project.toDto());
  }

  async listUsers(user: JwtUser, id: string, page: PageRequestDto) {
    await this.getProject(id, user);

    const { count, rows } = await User.findAndCountAll(
      Page.paged(
        {
          include: { model: Project, where: { id } },
          order: ['role', 'firstName', 'lastName'],
        },
        page,
      ),
    );

    return Page.getPageData<User, UserDetailsDto>(rows, page, count, (u) =>
      u.toDto(),
    );
  }

  async addUser(user: JwtUser, id: string, userId: string) {
    await this.getProject(id, user);

    try {
      await UserProject.create({ projectId: id, userId });
    } catch (_) {
      throw new TaskAppError('user_already_added', HttpStatus.CONFLICT);
    }
  }

  async removeUser(manager: JwtUser, id: string, userId: string) {
    await this.getProject(id, manager);

    const deletedCount = await UserProject.destroy({
      where: { userId, projectId: id },
    });

    if (!deletedCount) {
      throw new TaskAppError('user_not_added', HttpStatus.CONFLICT);
    }
  }

  async getStats(id: string, user: JwtUser) {
    await this.getProject(id, user);
    const stats: ProjectStatsDto = {
      boards: [],
      stages: [],
    };

    const stages = await Project.sequelize.query(
      'SELECT S.name as "name", COUNT(t.id) ' +
        'FROM "Boards" B ' +
        'JOIN "Stages" S on B.id = S."boardId" ' +
        'JOIN "Tasks" T on S.id = T."stageId" ' +
        'WHERE B."projectId" = :id ' +
        'AND T.deleted IS NULL ' +
        'AND T.completed IS NULL ' +
        'GROUP BY S.name;',
      { type: QueryTypes.SELECT, replacements: { id } },
    );
    for (let stage of stages) {
      stats.stages.push({ name: stage['name'], tasks: stage['count'] });
    }

    const boards = await Project.sequelize.query(
      'SELECT B.id as "id", T.completed as "isCompleted", COUNT(t.id) as "count" ' +
        'FROM "Boards" B ' +
        'JOIN "Stages" S on B.id = S."boardId" ' +
        'JOIN "Tasks" T on S.id = T."stageId" ' +
        'WHERE B."projectId" = :id AND T.deleted IS NULL ' +
        'GROUP BY B.id, T.completed;',
      { type: QueryTypes.SELECT, replacements: { id } },
    );
    for (const board of boards) {
      const index = stats.boards.findIndex((b) => b.id === board['id']);

      const boardItem = { id: board['id'], pendingTasks: 0, completedTasks: 0 };
      if (index > -1) {
        boardItem.pendingTasks = stats.boards[index].pendingTasks;
        boardItem.completedTasks = stats.boards[index].completedTasks;
      }

      if (board['isCompleted']) {
        boardItem.completedTasks = board['count'];
      } else {
        boardItem.pendingTasks = board['count'];
      }

      if (index > -1) {
        stats.boards.splice(index, 1, boardItem);
      } else {
        stats.boards.push(boardItem);
      }
    }

    return stats;
  }

  async getProject(id: string, user?: JwtUser) {
    const project = await Project.findByPk(id, { include: User });
    await this.checkAccess(project, user);

    return project;
  }

  async checkAccess(project?: Project, user?: JwtUser) {
    if (!project) {
      throw new TaskAppError('project_not_found', HttpStatus.NOT_FOUND);
    }

    if (user && user.role != Role.ADMIN && !user.isPartOfProject(project)) {
      throw new TaskAppError('no_access', HttpStatus.FORBIDDEN);
    }
  }
}
