import { Stage } from './stage.entity';
import { UUIDEntity } from '../uuid.entity';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Index,
  Table,
} from 'sequelize-typescript';
import { Project } from './project.entity';
import { BoardDto } from 'taskapp-common/dist/src/dto/board.dto';
import { DataTypes } from 'sequelize';
import { type } from 'os';

@Table({ paranoid: true })
export class Board extends UUIDEntity {
  @Column
  declare name: string;

  @Column
  declare color: string;

  @Index
  @Column
  declare archived: boolean;

  @BelongsTo(() => Project, { foreignKey: 'projectId', constraints: false })
  declare project: Project;

  @ForeignKey(() => Project)
  @Column(DataTypes.UUID)
  declare projectId: string;

  @HasMany(() => Stage)
  declare stages: Stage[];

  @Column({ type: DataType.JSONB, defaultValue: [] })
  declare stagesOrder: string[];

  toDto(): BoardDto {
    let stageOrders: any[] = this.stagesOrder;
    if (this.stages && stageOrders) {
      stageOrders = stageOrders.map((id) => {
        const stage = this.stages.find((s) => s.id === id);
        return stage.toDto();
      });
    }
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      stages: stageOrders,
      projectId: this.projectId,
    };
  }
}
