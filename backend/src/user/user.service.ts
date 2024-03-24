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

@Injectable()
export class UserService {
  constructor() {}

  findByEmail(email: string): Promise<User> {
    return User.findOne({ where: { email } });
  }

  getUserData(id: string): Promise<User> {
    return User.findOne({
      where: { id },
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'status'],
    });
  }

  async setupProfile(user: JwtUser, data: ProfileSetupDto) {
    const dbUser = await User.findByPk(user.id);
    if (dbUser.status !== UserStatus.INVITED) {
      throw new TaskAppError('user_profile_completed', HttpStatus.BAD_REQUEST);
    }
    const password: string = await bcrypt.hash(
      data.password,
      await bcrypt.genSalt(10),
    );

    dbUser.firstName = data.firstName;
    dbUser.lastName = data.lastName;
    dbUser.email = data.email;
    dbUser.password = password;
    dbUser.status = UserStatus.ACTIVE;

    await dbUser.save();
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

      const salt = await bcrypt.genSalt(10);
      const password: string = await bcrypt.hash(data.password, salt);

      const createdUser = await User.create({
        ...data,
        password,
        invitedBy: user.id,
      });

      const userProjects: any[] = projects.map(
        (project) =>
          <UserProject>{ userId: createdUser.id, projectId: project.id },
      );
      await UserProject.bulkCreate(userProjects);

      return createdUser.toDto();
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
        stats.completedTasks = +task['count'];
      } else {
        stats.pendingTasks = +task['count'];
      }
    }

    const dbUser = await User.findByPk(user.id, { include: [Project] });
    const ids = dbUser.projects.map((p) => p.id);

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
        stats.overallCompletedTasks = +task['count'];
      } else {
        stats.overallPendingTasks = +task['count'];
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
      stats.createdTasks = +task['count'];
    }

    const unassignedTasks = await User.sequelize.query(
      'SELECT COUNT(T.id) AS "count" ' +
        'FROM "Projects" P ' +
        'JOIN "Tasks" T on P.id = T."projectId" ' +
        'WHERE P.id IN (:ids) ' +
        '  AND T.assignee IS NULL;',
      { type: QueryTypes.SELECT, replacements: { ids } },
    );

    for (const task of createdTasks) {
      stats.overallUnassignedTasks = +task['count'];
    }

    stats.overallCreatedTasks =
      stats.overallPendingTasks +
      stats.overallUnassignedTasks +
      stats.overallCompletedTasks -
      stats.createdTasks;

    const stages = await Project.sequelize.query(
      'SELECT S.name as "name", S.color as "color", COUNT(t.id) ' +
        'FROM "Users" U ' +
        'JOIN "Tasks" T on U.id = T.author ' +
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
        tasks: +stage['count'],
        color: stage['color'],
      });
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
