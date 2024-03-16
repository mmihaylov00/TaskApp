import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Project } from '../project/project.entity';
import { Stage } from '../stage/stage.entity';
import { UUIDEntity } from '../abstract/uuid.entity';
import { BoardDto } from 'taskapp-common/dist/src/dto/board.dto';

@Entity('boards')
export class Board extends UUIDEntity {
  @Column()
  name: string;

  @Column()
  color: string;

  @ManyToOne(() => Project, (project) => project.boards)
  project: Project;

  @OneToMany(() => Stage, (stage) => stage.board)
  stages: Stage[];

  delete() {
    this.deleted = true;
    this.stages.forEach((stage) => stage.delete());
  }

  toDto(): BoardDto {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      projectId: this.project?.id,
    };
  }
}
