import { Role, ROLES } from 'taskapp-common/dist/src/enums/role.enum';
import { Task } from './task.entity';
import { UUIDEntity } from '../uuid.entity';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { UserProject } from './user-project.entity';
import { Project } from './project.entity';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';
import { sql } from '@sequelize/core';
import { DataTypes } from 'sequelize';
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

  @Column({
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: sql.uuidV4.asJavaScript,
  })
  declare invitationLink?: string;

  @Column({ type: DataType.ENUM, values: ROLES })
  declare role: Role;

  @Column({ defaultValue: false })
  declare disabled: boolean;

  @BelongsToMany(() => Project, () => UserProject)
  declare projects: Project[];

  @HasMany(() => Task, 'author')
  declare createdTasks: Task[];

  @HasMany(() => Task, 'assignee')
  declare assignedTasks: Task[];

  @Column({ allowNull: true, type: DataTypes.UUID })
  declare invitedBy?: string;

  toDto(): UserDetailsDto {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
      status: this.status(),
    };
  }

  status(): UserStatus {
    if (!this.password) {
      return UserStatus.INVITED;
    }
    if (this.disabled) {
      return UserStatus.DISABLED;
    }
    return UserStatus.ACTIVE;
  }
}
