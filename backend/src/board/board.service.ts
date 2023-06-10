import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { User } from '../user/user.entity';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { ProjectService } from '../project/project.service';
import { CreateBoardDto, UpdateBoardDto } from 'taskapp-common/dist/src/dto/board.dto';
import { TaskAppError } from '../error/task-app.error';

@Injectable()
export class BoardService {

  constructor(@InjectRepository(Board)
              private readonly repository: Repository<Board>,
              private readonly projectService: ProjectService) {
  }

  async list(user: User, projectId?: string) {
    const query = this.repository
      .createQueryBuilder('b')
      .innerJoin('b.project', 'p')
      .where('b.deleted = false');

    if (user.role !== Role.ADMIN) {
      query.innerJoin('p.users', 'u')
        .andWhere('u.id = :userId', { userId: user.id });
    }

    if (projectId) {
      query.andWhere('p.id = :projectId', { projectId });
    }

    const boards = await query.getMany();
    return boards.map(board => {
      return {
        ...board,
        projectId: board.project.id
      };
    });
  }

  async create(user, data: CreateBoardDto) {
    const project = await this.projectService.getProject(data.projectId, user);

    try {
      await this.repository.insert({ ...data, project });
    } catch (_) {
      throw new TaskAppError('board_creation_failed', HttpStatus.BAD_REQUEST);
    }
  }

  async update(user: User, id: string, data: UpdateBoardDto) {
    const board = await this.getBoard(id, user);
    board.color = data.color;
    board.name = data.name;

    try {
      await this.repository.save(board);
    } catch (_) {
      throw new TaskAppError('board_update_failed', HttpStatus.CONFLICT);
    }
  }

  async delete(user: User, id: string) {
    const board = await this.getBoard(id, user);
    board.delete();

    try {
      await this.repository.save(board);
    } catch (_) {
      throw new TaskAppError('board_not_deleted', HttpStatus.BAD_REQUEST);
    }
  }

  async getBoard(id: string, user?: User) {
    const board = await this.repository.findOneBy({ id, deleted: false });
    this.projectService.checkAccess(board?.project, user);

    return board;
  }
}
