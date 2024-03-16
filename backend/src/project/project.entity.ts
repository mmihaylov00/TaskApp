import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Board } from '../board/board.entity';
import { UUIDEntity } from '../abstract/uuid.entity';
import { BoardDto } from 'taskapp-common/dist/src/dto/board.dto';
import { ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';

@Entity('projects')
export class Project extends UUIDEntity {
  @Column()
  name: string;

  @Column()
  color: string;

  @ManyToMany(() => User)
  @JoinTable({ name: 'project_users' })
  users: User[];

  @OneToMany(() => Board, (board) => board.project)
  boards: Board[];

  delete() {
    this.deleted = true;
    this.boards?.forEach((board) => board.delete());
  }

  toDto(): ProjectDto {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      boards: this.boards?.map((value) => value.toDto()),
    };
  }
}
