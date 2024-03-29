import * as dotenv from 'dotenv';
import configuration from '../config/configuration';
import { Project } from './entity/project.entity';
import { Sequelize } from 'sequelize-typescript';
import { Stage } from './entity/stage.entity';
import { User } from './entity/user.entity';
import { UserProject } from './entity/user-project.entity';
import { Board } from './entity/board.entity';
import { Task } from './entity/task.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';
import { Attachment } from './entity/attachment.entity';
import { Notification } from './entity/notification.entity';

dotenv.config();

const seed = async () => {
  const salt = await bcrypt.genSalt(10);
  const password: string = await bcrypt.hash('password', salt);

  try {
    await User.create({
      email: 'admin@task.app',
      firstName: 'Super',
      lastName: 'Admin',
      password,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      invitationLink: null,
    });
  } catch (_) {}
};

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: configuration().db.host,
        port: configuration().db.port,
        username: configuration().db.username,
        password: configuration().db.password,
        database: configuration().db.database_name,
        // logging: false,
      });
      sequelize.addModels([
        User,
        Project,
        UserProject,
        Board,
        Stage,
        Task,
        Attachment,
        Notification,
      ]);
      await sequelize.sync();
      await seed();
      return sequelize;
    },
  },
];
