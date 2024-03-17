import { Stage } from './stage.entity';
import { User } from './user.entity';
import { UUIDEntity } from '../uuid.entity';
import {
  TASK_PRIORITIES,
  TaskDto,
  TaskPriority,
} from 'taskapp-common/dist/src/dto/task.dto';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ paranoid: true })
export class Task extends UUIDEntity {
  @Column
  declare name: string;

  @Column(DataType.TEXT)
  declare description: string;

  @AllowNull
  @Column({ type: DataType.ENUM, values: TASK_PRIORITIES })
  declare priority: TaskPriority;

  @BelongsTo(() => Stage, 'stage_id')
  declare stage: Stage;

  @ForeignKey(() => Stage)
  @Column(DataTypes.UUID)
  declare stageId: string;

  @ForeignKey(() => User)
  @Column(DataTypes.UUID)
  declare creatorId: string;

  @BelongsTo(() => User, 'creator_id')
  declare creator: User;

  @BelongsTo(() => User)
  declare assignedTo?: User;

  @Column({ allowNull: true })
  declare deadline?: Date;

  toDto(): TaskDto {
    return {
      id: this.id,
      title: this.name,
      description: this.description,
      priority: this.priority,
      author: this.creator.toDto(),
      assignee: this.assignedTo?.toDto(),
      deadline: this.deadline,
    };
  }
}
