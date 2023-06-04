import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Board } from '../board/board.entity';
import { Task } from '../task/task.entity';
import { UUIDEntity } from '../abstract/uuid.entity';

@Entity('stages')
export class Stage extends UUIDEntity {
  @Column()
  name: string;

  @Column()
  color: string;

  @ManyToOne(() => Board, board => board.stages)
  board: Board;

  @OneToMany(() => Task, task => task.stage)
  tasks: Task[];

  @Column('json')
  tasksOrder: string[] = [];

  delete() {
    this.deleted = true;
    this.tasks.forEach((task) => task.delete());
  }
}
