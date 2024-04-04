import { User } from './user.entity';
import { UUIDEntity } from '../uuid.entity';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { NotificationDto } from 'taskapp-common/dist/src/dto/notification.dto';

@Table({ paranoid: true, timestamps: false })
export class Notification extends UUIDEntity {
  @Column
  declare message: string;

  @Column
  declare link: string;

  @Index
  @Column({ allowNull: true })
  declare read: boolean;

  @Index
  @Column({ allowNull: true })
  declare deleted: boolean;

  @BelongsTo(() => User, 'userId')
  declare user: User;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare userId: string;

  @Index
  @Column({ defaultValue: Sequelize.fn('now') })
  declare createdAt: Date;

  toDto(): NotificationDto {
    return {
      id: this.id,
      message: this.message,
      createdAt: this.createdAt,
      link: this.link,
    };
  }
}
