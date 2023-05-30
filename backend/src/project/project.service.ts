import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { CreateProjectDto, ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';
import { TaskAppError } from '../error/task-app.error';

@Injectable()
export class ProjectService {

  constructor(@InjectRepository(Project)
              private readonly repository: Repository<Project>) {
  }

  async list(user: User, page: PageRequestDto): Promise<Page<ProjectDto>> {
    const query = this.repository.createQueryBuilder('p');
    if (user.role !== Role.ADMIN) {
      query.leftJoinAndSelect('p.users', 'u')
        .where('u.id = :userId', { userId: user.id });
    }

    const [projects, count] = await query.skip((page.page - 1) * page.pageAmount)
      .take(page.pageAmount).getManyAndCount();

    return new Page<ProjectDto>({
      items: projects.map(value => {
        return { ...value };
      }),
      count, page
    });
  }

  async create(user: User, data: CreateProjectDto): Promise<void> {
    try {
      await this.repository.insert({
        ...data,
        users: [user]
      });
    } catch (_) {
      throw new TaskAppError('project_already_exists', HttpStatus.CONFLICT);
    }
  }

  async delete(id: string) {
    try {
      await this.repository.delete(id);
    } catch (_) {
      throw new TaskAppError('project_not_deleted', HttpStatus.NOT_FOUND);
    }
  }
}
