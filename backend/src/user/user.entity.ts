import { Column, Entity, Generated, JoinColumn, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { Project } from '../project/project.entity';
import { Task } from '../task/task.entity';
import { UUIDEntity } from '../abstract/uuid.entity';

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
    enum: Role
  })
  role: Role;

  @ManyToMany(() => Project)
  projects: Project[];

  @OneToMany(() => Task, task => task.author)
  createdTasks: Task[];

  @OneToMany(() => Task, task => task.assignee)
  assignedTasks: Task[];

  @OneToMany(type => User, user => user.id, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  invitedBy?: User;

  public isPartOfProject(project: Project) {
    return project.users.some(u => u.id = this.id);
  }
}
