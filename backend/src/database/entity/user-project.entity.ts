import { Column, ForeignKey, Index, Model, Table } from 'sequelize-typescript';
import { User } from './user.entity';
import { Project } from './project.entity';
import { DataTypes } from 'sequelize';

@Table
export class UserProject extends Model {
  @Column(DataTypes.UUID)
  @Index('user_project')
  @ForeignKey(() => User)
  declare userId: string;

  @Column(DataTypes.UUID)
  @Index('user_project')
  @ForeignKey(() => Project)
  declare projectId: string;
}
