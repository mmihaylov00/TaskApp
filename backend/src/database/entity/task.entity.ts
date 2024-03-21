import { Stage } from './stage.entity';
import { User } from './user.entity';
import { UUIDEntity } from '../uuid.entity';
import { TaskDto } from 'taskapp-common/dist/src/dto/task.dto';
import {
  TASK_PRIORITIES,
  TaskPriority,
} from 'taskapp-common/dist/src/enums/task-priority.enum';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ paranoid: true, timestamps: false })
export class Task extends UUIDEntity {
  @Column
  declare name: string;

  @Column(DataType.JSONB)
  declare description: any;

  @AllowNull
  @Column({ type: DataType.ENUM, values: TASK_PRIORITIES })
  declare priority: TaskPriority;

  @ForeignKey(() => Stage)
  @Column(DataTypes.UUID)
  declare stageId: string;

  @BelongsTo(() => Stage, 'stageId')
  declare stage: Stage;

  @ForeignKey(() => User)
  @Column(DataTypes.UUID)
  declare author: string;

  @BelongsTo(() => User, 'author')
  declare creator: User;

  @ForeignKey(() => User)
  @Column({ allowNull: true, type: DataType.UUID })
  declare assignee?: string;

  @BelongsTo(() => User, 'assignee')
  declare assignedTo?: User;

  @Column({ allowNull: true })
  declare deadline?: Date;

  @Column({ defaultValue: new Date() })
  declare createdAt: Date;

  @Column
  declare updatedAt?: Date;

  @Column
  declare deleted: boolean;

  @Column
  declare archived: boolean;

  toDto(): TaskDto {
    return {
      id: this.id,
      title: this.name,
      description: this.description,
      priority: this.priority,
      stage: this.stageId,
      author: this.creator?.toDto(),
      assignee: this.assignedTo?.toDto(),
      updatedAt: this.updatedAt,
      createdAt: this.updatedAt,
      deadline: this.deadline,
    };
  }
}
