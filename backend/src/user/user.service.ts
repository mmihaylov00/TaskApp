import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../database/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { JwtUser } from '../auth/decorator/jwt-user.dto';
import {
  ProfileSetupDto,
  UserDetailsDto,
} from 'taskapp-common/dist/src/dto/auth.dto';
import { Project } from '../database/entity/project.entity';
import {
  CreateUserDto,
  SearchUserDto,
} from 'taskapp-common/dist/src/dto/user.dto';
import { TaskAppError } from '../error/task-app.error';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { UserProject } from '../database/entity/user-project.entity';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';
import sequelize, { Op } from 'sequelize';

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
    const salt = await bcrypt.genSalt(10);
    const password: string = await bcrypt.hash(data.password, salt);

    dbUser.firstName = data.firstName;
    dbUser.lastName = data.lastName;
    dbUser.email = data.email;
    dbUser.password = password;
    dbUser.status = UserStatus.ACTIVE;

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
