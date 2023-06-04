import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Project } from '../project/project.entity';
import { Stage } from '../stage/stage.entity';
import { UUIDEntity } from '../abstract/uuid.entity';

@Entity('boards')
export class Board extends UUIDEntity {
  @Column()
  name: string;

  @Column()
  color: string;

  @ManyToOne(() => Project, project => project.boards)
  project: Project;

  @OneToMany(() => Stage, stage => stage.board)
  stages: Stage[];

  delete() {
    this.deleted = true;
    this.stages.forEach((stage) => stage.delete());
  }
}
