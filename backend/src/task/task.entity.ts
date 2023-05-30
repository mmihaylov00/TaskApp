import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Board } from '../board/board.entity';
import { Stage } from '../stage/stage.entity';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { TaskPriority } from 'taskapp-common/dist/src/enums/task-priority.enum';
import { User } from '../user/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column("text")
  description: string;

  @Column({
    type: "enum",
    enum: TaskPriority,
    nullable: true
  })
  priority?: TaskPriority;

  @ManyToOne(() => Stage, stage => stage.tasks)
  stage: Stage;

  @ManyToOne(() => User, user => user.createdTasks)
  author: User;

  @ManyToOne(() => User, user => user.assignedTasks, {nullable: true})
  assignee?: User;

  @Column('date', { nullable: true })
  deadline?: Date;
}
