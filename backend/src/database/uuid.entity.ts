import { Column, Model } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { sql } from '@sequelize/core';

export abstract class UUIDEntity extends Model {
  @Column({
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: sql.uuidV4.asJavaScript,
  })
  declare id: string;
}
