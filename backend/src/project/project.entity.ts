import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  color: string;

  @ManyToMany(() => User)
  @JoinTable({name: 'project_users'})
  users: User[];
}
