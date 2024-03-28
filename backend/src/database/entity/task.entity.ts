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
  HasMany,
  Index,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Attachment } from './attachment.entity';
import { Project } from './project.entity';
import { ThumbnailUpdatedDto } from 'taskapp-common/dist/src/dto/attachment.dto';

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

  @BelongsTo(() => Project, { foreignKey: 'projectId', constraints: false })
  declare project: Project;

  @ForeignKey(() => Project)
  @Column(DataTypes.UUID)
  declare projectId: string;

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

  @ForeignKey(() => User)
  @Column({ allowNull: true, type: DataType.UUID })
  declare updatedBy?: string;

  @BelongsTo(() => User, 'updatedBy')
  declare updatedByUser?: User;

  @Index
  @Column({ allowNull: true })
  declare deadline?: Date;

  @Column({ defaultValue: new Date() })
  declare createdAt: Date;

  @Column
  declare updatedAt?: Date;

  @Index('closed')
  @Column
  declare deleted: boolean;

  @Index('closed')
  @Column
  declare completed: boolean;

  @HasMany(() => Attachment, 'taskId')
  declare attachments: Attachment[];

  @Column({ allowNull: true })
  declare thumbnail?: string;

  toDto(): TaskDto {
    return {
      id: this.id,
      title: this.name,
      description: this.description,
      priority: this.priority,
      stage: this.stageId,
      author: this.creator?.toDto(),
      assignee: this.assignedTo?.toDto(),
      updatedBy: this.updatedByUser?.toDto(),
      updatedAt: this.updatedAt,
      createdAt: this.createdAt,
      deadline: this.deadline,
      thumbnail: this.thumbnail,
      attachments: this.attachments?.map((a) => a.toDto()),
      completed: this.completed,
    };
  }

  toThumbnailDto(): ThumbnailUpdatedDto {
    return {
      taskId: this.id,
      thumbnail: this.thumbnail,
    };
  }
}
