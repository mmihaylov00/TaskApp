import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { Task } from '../task/task.entity';
import { UUIDEntity } from '../abstract/uuid.entity';
import { Project } from '../project/project.entity';
import { TaskDto } from 'taskapp-common/dist/src/dto/task.dto';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';

@Entity('users')
export class User extends UUIDEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column({ nullable: true })
  @Generated('uuid')
  invitationLink?: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @ManyToMany(() => Project)
  projects: Project[];

  @OneToMany(() => Task, (task) => task.author)
  createdTasks: Task[];

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks: Task[];

  @OneToMany((type) => User, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  invitedBy?: User;

  toDto(): UserDetailsDto {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
    };
  }
}
