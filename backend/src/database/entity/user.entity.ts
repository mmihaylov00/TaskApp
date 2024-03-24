import { Role, ROLES } from 'taskapp-common/dist/src/enums/role.enum';
import { Task } from './task.entity';
import { UUIDEntity } from '../uuid.entity';
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { UserProject } from './user-project.entity';
import { Project } from './project.entity';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import {
  USER_STATUSES,
  UserStatus,
} from 'taskapp-common/dist/src/enums/user-status.enum';
import { DataTypes } from 'sequelize';
import { Attachment } from './attachment.entity';

@Table({ paranoid: true })
export class User extends UUIDEntity {
  @Column({ unique: true })
  declare email: string;

  @Column({ allowNull: true })
  declare password?: string;

  @Column({ allowNull: true })
  declare firstName?: string;

  @Column({ allowNull: true })
  declare lastName?: string;

  @Column({ type: DataType.ENUM, values: ROLES })
  declare role: Role;

  @Column({
    type: DataType.ENUM,
    values: USER_STATUSES,
    defaultValue: UserStatus.INVITED,
  })
  declare status: UserStatus;

  @BelongsToMany(() => Project, () => UserProject)
  declare projects: Project[];

  @HasMany(() => Task, 'author')
  declare createdTasks: Task[];

  @HasMany(() => Task, 'assignee')
  declare assignedTasks: Task[];

  @HasMany(() => Task, 'updatedBy')
  declare lastUpdatedTasks: Task[];

  @HasMany(() => Task, 'uploader')
  declare uploadedAttachments: Attachment[];

  @Column({ allowNull: true, type: DataTypes.UUID })
  declare invitedBy?: string;

  toDto(): UserDetailsDto {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
      status: this.status,
    };
  }
}
