import { Board } from './board.entity';
import { Task } from './task.entity';
import { UUIDEntity } from '../uuid.entity';
import { StageDto } from 'taskapp-common/dist/src/dto/stage.dto';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Index,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ paranoid: true })
export class Stage extends UUIDEntity {
  @Index
  @Column
  declare name: string;

  @Column
  declare color: string;

  @BelongsTo(() => Board, 'board_id')
  declare board: Board;

  @ForeignKey(() => Board)
  @Column(DataTypes.UUID)
  declare boardId: string;

  @HasMany(() => Task)
  declare tasks: Task[];

  @Column({ type: DataType.JSONB, defaultValue: [] })
  declare tasksOrder: string[];

  toDto(): StageDto {
    let taskOrders: any[] = this.tasksOrder;
    if (this.tasks && taskOrders) {
      taskOrders = taskOrders
        .map((id) => {
          const task = this.tasks.find((t) => t.id === id);
          if (!task) return undefined;
          return task.toDto();
        })
        .filter((task) => task);
    }
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      tasks: taskOrders,
    };
  }
}
