import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../database/entity/user.entity';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import {
  CreateProjectDto,
  ProjectDto,
} from 'taskapp-common/dist/src/dto/project.dto';
import { TaskAppError } from '../error/task-app.error';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import { Project } from '../database/entity/project.entity';
import { Board } from '../database/entity/board.entity';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { UserProject } from '../database/entity/user-project.entity';

@Injectable()
export class ProjectService {
  constructor() {}

  async list(user: JwtUser, page: PageRequestDto) {
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
        { name: data.name, color: data.color },
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
          where: { disabled: false },
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

  async addUser(manager: JwtUser, id: string, userId: string) {
    await this.getProject(id, manager);

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

  async getProject(id: string, manager?: JwtUser) {
    const project = await Project.findOne({ where: { id }, include: User });
    await this.checkAccess(project, manager);

    return project;
  }

  async checkAccess(project?: Project, manager?: JwtUser) {
    if (!project) {
      throw new TaskAppError('project_not_found', HttpStatus.NOT_FOUND);
    }

    if (
      manager &&
      manager.role != Role.ADMIN &&
      !manager.isPartOfProject(project)
    ) {
      throw new TaskAppError('no_access', HttpStatus.FORBIDDEN);
    }
  }
}
