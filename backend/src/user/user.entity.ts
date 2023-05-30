import {
  Column,
  Entity,
  OneToOne,
  Generated,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { Project } from '../project/project.entity';
import { Task } from '../task/task.entity';

@Entity('users')
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

  @Column()
  enabled: boolean = false;

  @Column()
  @Generated("uuid")
  invitationLink?: string;

  @Column({
    type: "enum",
    enum: Role
  })
  role: Role;

  @ManyToMany(() => Project)
  projects: Project[];

  @OneToMany(() => Task, task => task.author)
  createdTasks: Task[];

  @OneToMany(() => Task, task => task.assignee)
  assignedTasks: Task[];

  @OneToOne(type => User, user => user.id, {
    cascade: true,
    onDelete: "CASCADE"
  })
  @JoinColumn()
  invitedBy?: User;
}
