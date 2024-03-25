import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../database/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import {
  ProfileSetupDto,
  UpdatePasswordDto,
  UserDetailsDto,
} from 'taskapp-common/dist/src/dto/auth.dto';
import { Project } from '../database/entity/project.entity';
import {
  CreateUserDto,
  SearchUserDto,
  UserStatsDto,
} from 'taskapp-common/dist/src/dto/user.dto';
import { TaskAppError } from '../error/task-app.error';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { UserProject } from '../database/entity/user-project.entity';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';
import sequelize, { Op, QueryTypes } from 'sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly authService: AuthService,
  ) {}

  findByEmail(email: string): Promise<User> {
    return User.findOne({ where: { email } });
  }

  getUserData(id: string): Promise<User> {
    return User.findOne({
      where: { id },
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'status'],
    });
  }

  async getInvitationUser(invitationLink: string) {
    const user = await User.findOne({
      where: { invitationLink },
      attributes: ['firstName', 'lastName', 'email'],
    });
    if (!user) {
      throw new TaskAppError('user_not_found', HttpStatus.NOT_FOUND);
    }
    return user.toDto();
  }

  async setupProfile(data: ProfileSetupDto): Promise<UserDetailsDto> {
    const user = await User.findOne({
      where: { invitationLink: data.invitationLink },
    });
    if (user.status !== UserStatus.INVITED) {
      throw new TaskAppError('user_profile_completed', HttpStatus.BAD_REQUEST);
    }
    const password: string = await bcrypt.hash(
      data.password,
      await bcrypt.genSalt(10),
    );

    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.email = data.email;
    user.password = password;
    user.status = UserStatus.ACTIVE;
    user.invitationLink = null;

    await user.save();

    return { ...user.toDto(), token: this.authService.login(user) };
  }

  async changePassword(user: JwtUser, data: UpdatePasswordDto) {
    const dbUser = await this.loginUser(user.email, data.oldPassword);
    if (!dbUser) {
      throw new TaskAppError('invalid_password', HttpStatus.BAD_REQUEST);
    }

    dbUser.password = await bcrypt.hash(
      data.newPassword,
      await bcrypt.genSalt(10),
    );

    await dbUser.save();
  }

  async loginUser(email: string, pass: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    return (await bcrypt.compare(pass, user.password)) ? user : null;
  }

  async list(page: PageRequestDto): Promise<Page<UserDetailsDto>> {
    const { count, rows } = await User.findAndCountAll(
      Page.paged({ order: [['createdAt', 'DESC']] }, page),
    );

    return Page.getPageData<User, UserDetailsDto>(rows, page, count, (user) =>
      user.toDto(),
    );
  }

  async invite(user: JwtUser, data: CreateUserDto): Promise<UserDetailsDto> {
    const dbUser = await User.findByPk(user.id);

    try {
      const include = {
        model: User,
        where: {
          id: user.id,
        },
      };

      const projects = await Project.findAll({
        include: user.role !== Role.ADMIN ? [include] : [],
        where: { id: data.projectIds },
      });

      const createdUser = await User.create({
        ...data,
        invitedBy: user.id,
      });

      const userProjects: any[] = projects.map(
        (project) =>
          <UserProject>{ userId: createdUser.id, projectId: project.id },
      );
      await UserProject.bulkCreate(userProjects);

      const userDetails = createdUser.toDto();

      this.eventEmitter.emit('user.invitation', {
        user: userDetails,
        invitationLink: createdUser.invitationLink,
        invitedBy: dbUser.toDto(),
      });

      return userDetails;
    } catch (_) {
      throw new TaskAppError('user_exists', HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    user: JwtUser,
    id: string,
    data: CreateUserDto,
  ): Promise<UserDetailsDto> {
    try {
      const include = {
        model: User,
        where: {
          id: user.id,
        },
      };

      let dbUser = await User.findByPk(id);
      dbUser.email = data.email;
      dbUser.firstName = data.firstName;
      dbUser.lastName = data.lastName;
      dbUser.role = data.role;
      await dbUser.save();
      await UserProject.destroy({ where: { userId: dbUser.id } });

      const projects = await Project.findAll({
        include: user.role !== Role.ADMIN ? [include] : [],
        where: { id: data.projectIds },
      });

      const userProjects: any[] = projects.map(
        (project) => <UserProject>{ userId: dbUser.id, projectId: project.id },
      );
      await UserProject.bulkCreate(userProjects);

      return dbUser.toDto();
    } catch (_) {
      throw new TaskAppError('user_exists', HttpStatus.BAD_REQUEST);
    }
  }

  async changeStatus(
    user: JwtUser,
    id: string,
    status: UserStatus,
  ): Promise<void> {
    try {
      let dbUser = await User.findByPk(id);
      dbUser.status = status;
      await dbUser.save();
    } catch (_) {
      throw new TaskAppError('user_exists', HttpStatus.BAD_REQUEST);
    }
  }

  async stats(user: JwtUser) {
    const stats: UserStatsDto = {
      completedTasks: 0,
      pendingTasks: 0,
      createdTasks: 0,
      overallCompletedTasks: 0,
      overallPendingTasks: 0,
      overallCreatedTasks: 0,
      overallUnassignedTasks: 0,
      taskBoards: [],
      taskStages: [],
    };
    const userTasks = await User.sequelize.query(
      'SELECT T.completed as "isCompleted", COUNT(T.id) AS "count" ' +
        'FROM "Users" U ' +
        'JOIN "Tasks" T on U.id = T.assignee ' +
        'WHERE U.id = :id AND T.deleted IS NULL ' +
        'GROUP BY T.completed;',
      { type: QueryTypes.SELECT, replacements: { id: user.id } },
    );

    for (const task of userTasks) {
      if (task['isCompleted']) {
        stats.completedTasks = +task['count'] || 0;
      } else {
        stats.pendingTasks = +task['count'] || 0;
      }
    }

    const dbUser = await User.findByPk(user.id, { include: [Project] });
    const ids = dbUser.projects.map((p) => p.id);

    if (ids.length) {
      const overallTasks = await User.sequelize.query(
        'SELECT T.completed as "isCompleted", COUNT(T.id) AS "count"' +
          'FROM "Projects" P ' +
          'JOIN "Tasks" T on P.id = T."projectId" ' +
          'WHERE P.id IN (:ids) AND T.assignee != :userId AND T.deleted IS NULL ' +
          'GROUP BY T.completed;',
        {
          type: QueryTypes.SELECT,
          replacements: {
            ids,
            userId: user.id,
          },
        },
      );

      for (const task of overallTasks) {
        if (task['isCompleted']) {
          stats.overallCompletedTasks = +task['count'] || 0;
        } else {
          stats.overallPendingTasks = +task['count'] || 0;
        }
      }
    }

    const createdTasks = await User.sequelize.query(
      'SELECT COUNT(T.id) AS "count" ' +
        'FROM "Users" U ' +
        'JOIN "Tasks" T on U.id = T.author ' +
        'WHERE U.id = :id AND T.deleted IS NULL;',
      { type: QueryTypes.SELECT, replacements: { id: user.id } },
    );

    for (const task of createdTasks) {
      stats.createdTasks = +task['count'] || 0;
    }

    if (ids.length) {
      const unassignedTasks = await User.sequelize.query(
        'SELECT COUNT(T.id) AS "count" ' +
          'FROM "Projects" P ' +
          'JOIN "Tasks" T on P.id = T."projectId" ' +
          'WHERE P.id IN (:ids) ' +
          'AND T.assignee IS NULL;',
        { type: QueryTypes.SELECT, replacements: { ids } },
      );

      for (const task of unassignedTasks) {
        stats.overallUnassignedTasks = +task['count'] || 0;
      }
    }

    stats.overallCreatedTasks =
      stats.overallUnassignedTasks +
      stats.overallPendingTasks +
      stats.overallCompletedTasks +
      stats.pendingTasks +
      stats.completedTasks -
      stats.createdTasks;

    const stages = await User.sequelize.query(
      'SELECT S.name as "name", S.color as "color", COUNT(t.id) ' +
        'FROM "Users" U ' +
        'JOIN "Tasks" T on U.id = T.assignee ' +
        'JOIN "Stages" S on T."stageId" = S.id ' +
        'WHERE U."id" = :id ' +
        'AND T.deleted IS NULL ' +
        'AND T.completed IS NULL ' +
        'GROUP BY S.name, S.color;',
      { type: QueryTypes.SELECT, replacements: { id: user.id } },
    );
    for (const stage of stages) {
      stats.taskStages.push({
        name: stage['name'],
        tasks: +stage['count'] || 0,
        color: stage['color'],
      });
    }

    const boards = await User.sequelize.query(
      'SELECT B.name as "name", ' +
        'T.completed as "isCompleted", COUNT(t.id) as "count" ' +
        'FROM "Users" U ' +
        'JOIN "Tasks" T on U.id = T.assignee ' +
        'JOIN "Stages" S on T."stageId" = S.id ' +
        'JOIN "Boards" B on B.id = S."boardId" ' +
        'WHERE U."id" = :id AND T.deleted IS NULL AND B.archived IS NULL ' +
        'GROUP BY B.id, B.name, T.completed;',
      { type: QueryTypes.SELECT, replacements: { id: user.id } },
    );

    for (const board of boards) {
      const index = stats.taskBoards.findIndex((b) => b.name == board['name']);
      const taskBoard =
        index > -1
          ? stats.taskBoards[index]
          : {
              name: board['name'],
              pendingTasks: 0,
              completedTasks: 0,
            };

      if (board['isCompleted']) {
        taskBoard.completedTasks += +board['count'] || 0;
      } else {
        taskBoard.pendingTasks += +board['count'] || 0;
      }

      if (index > -1) {
        stats.taskBoards.splice(index, 1, taskBoard);
      } else {
        stats.taskBoards.push(taskBoard);
      }
    }

    return stats;
  }

  async find(user: JwtUser, data: SearchUserDto) {
    const nameCol = sequelize.fn(
      'CONCAT',
      sequelize.fn('LOWER', sequelize.col('firstName')),
      ' ',
      sequelize.fn('LOWER', sequelize.col('lastName')),
      ' ',
      sequelize.fn('LOWER', sequelize.col('email')),
    );

    const where = {
      [Op.and]: [
        sequelize.where(nameCol, { [Op.substring]: data.name }),
        { id: { [Op.notIn]: [user.id, ...data.userIds] } },
      ],
    };
    const users = await User.findAll({
      where,
      limit: 5,
      order: ['firstName', 'lastName', 'email'],
    });
    return users.map((user) => user.toDto());
  }
}
