import { Column, Model } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

export abstract class UUIDEntity extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  })
  declare id: string;
}
