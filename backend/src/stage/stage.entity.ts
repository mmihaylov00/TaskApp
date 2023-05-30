import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Board } from '../board/board.entity';
import { Task } from '../task/task.entity';

@Entity('stages')
export class Stage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
}
