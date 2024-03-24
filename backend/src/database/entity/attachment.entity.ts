import { User } from './user.entity';
import { UUIDEntity } from '../uuid.entity';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { Task } from './task.entity';
import { AttachmentDataDto } from 'taskapp-common/dist/src/dto/attachment.dto';

@Table({ paranoid: true, timestamps: false })
export class Attachment extends UUIDEntity {
  @Column
  declare name: string;
  @Column
  declare mime: string;

  @Column
  declare extension: string;

  @BelongsTo(() => User, 'uploader')
  declare uploadedBy: User;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare uploader?: string;

  @BelongsTo(() => Task, 'taskId')
  declare task: Task;

  @ForeignKey(() => Task)
  @Column(DataType.UUID)
  declare taskId?: string;

  toDto(): AttachmentDataDto {
    return {
      id: this.id,
      name: this.name,
      extension: this.extension,
      mime: this.mime,
    };
  }
}
