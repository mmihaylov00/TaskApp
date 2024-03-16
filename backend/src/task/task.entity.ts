import { Column, Entity, ManyToOne } from 'typeorm';
import { Stage } from '../stage/stage.entity';
import { User } from '../user/user.entity';
import { UUIDEntity } from '../abstract/uuid.entity';
import { TaskDto, TaskPriority } from 'taskapp-common/dist/src/dto/task.dto';
import { ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';

@Entity('tasks')
export class Task extends UUIDEntity {
  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    nullable: true,
  })
  priority?: TaskPriority;

  @ManyToOne(() => Stage, (stage) => stage.tasks)
  stage: Stage;

  @ManyToOne(() => User, (user) => user.createdTasks)
  author: User;

  @ManyToOne(() => User, (user) => user.assignedTasks, { nullable: true })
  assignee?: User;

  @Column('date', { nullable: true })
  deadline?: Date;

  delete() {
    this.deleted = true;
  }

  toDto(): TaskDto {
    return {
      id: this.id,
      title: this.name,
      description: this.description,
      priority: this.priority,
      author: this.author.toDto(),
      assignee: this.assignee?.toDto(),
      deadline: this.deadline,
    };
  }
}
