import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { CreateProjectDto, ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';
import { TaskAppError } from '../error/task-app.error';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';

@Injectable()
export class ProjectService {

  constructor(@InjectRepository(Project)
              private readonly repository: Repository<Project>,
              @InjectRepository(User)
              private readonly userRepository: Repository<User>) {
  }

  async list(user: User, page: PageRequestDto) {
    const query = this.repository.createQueryBuilder('p')
      .where('p.deleted = false');
    if (user.role !== Role.ADMIN) {
      query.leftJoinAndSelect('p.users', 'u')
        .andWhere('u.id = :userId', { userId: user.id });
    }

    return Page.getPageData<ProjectDto, Project>(query, page,
      (p) => {
        return { ...p };
      });
  }

  async create(user: User, data: CreateProjectDto) {
    try {
      await this.repository.insert({
        ...data,
        users: [user]
      });
    } catch (_) {
      throw new TaskAppError('project_not_created', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, data: CreateProjectDto) {
    try {
      await this.repository.update(id, { ...data });
    } catch (_) {
      throw new TaskAppError('project_not_created', HttpStatus.BAD_REQUEST);
    }
  }

  async delete(id: string) {
    const project = await this.getProject(id);
    project.delete();

    try {
      await this.repository.save(project);
    } catch (_) {
      throw new TaskAppError('project_not_deleted', HttpStatus.BAD_REQUEST);
    }
  }

  async listUsers(user: User, id: string, page: PageRequestDto) {
    await this.getProject(id, user);

    const query = this.userRepository
      .createQueryBuilder('u')
      .innerJoin('u.projects', 'p')
      .where('p.id = :id', { id });

    return Page.getPageData<UserDetailsDto, User>(query, page,
      (u) => <UserDetailsDto>{ ...u });
  }

  async addUser(manager: User, id: string, userId: string) {
    const project = await this.getProject(id, manager);

    if (project.users?.some(u => u.id === id)) {
      throw new TaskAppError('user_already_added', HttpStatus.CONFLICT);
    }

    if (!project.users) project.users = [];

    const user = await this.userRepository.findOneBy({ id: userId });
    project.users.push(user);
    await this.repository.save(project);
  }

  async removeUser(manager: User, id: string, userId: string) {
    const project = await this.getProject(id, manager);

    if (!project.users?.some(u => u.id === id)) {
      throw new TaskAppError('user_not_added', HttpStatus.CONFLICT);
    }

    project.users = project.users?.filter(u => u.id !== userId);
    await this.repository.save(project);
  }

  async getProject(id: string, manager?: User) {
    const project = await this.repository.findOneBy({ id, deleted: false });
    this.checkAccess(project, manager);

    return project;
  }

  checkAccess(project?: Project, manager?: User) {
    if (!project) {
      throw new TaskAppError('project_not_found', HttpStatus.NOT_FOUND);
    }

    if (manager && (manager.role != Role.ADMIN || !manager.isPartOfProject(project))) {
      throw new TaskAppError('no_access', HttpStatus.FORBIDDEN);
    }
  }
}
