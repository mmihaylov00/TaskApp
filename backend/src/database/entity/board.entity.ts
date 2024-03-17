import { Stage } from './stage.entity';
import { UUIDEntity } from '../uuid.entity';
import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
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

  @BelongsTo(() => Project, { foreignKey: 'projectId', constraints: false })
  declare project: Project;

  @ForeignKey(() => Project)
  @Column(DataTypes.UUID)
  declare projectId: string;

  @HasMany(() => Stage)
  declare stages: Stage[];

  toDto(): BoardDto {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      projectId: this.projectId,
    };
  }
}
