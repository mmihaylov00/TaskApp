import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Project } from '../project/project.entity';
import { Stage } from '../stage/stage.entity';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  color: string;

  @ManyToOne(() => Project, project => project.boards)
  project: Project;

  @OneToMany(() => Stage, stage => stage.board)
  stages: Stage[];
}
