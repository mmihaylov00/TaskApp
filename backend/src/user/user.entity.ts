import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from './enums/role.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  password?: string;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column({
    type: "enum",
    enum: RoleEnum
  })
  role: RoleEnum;
}
