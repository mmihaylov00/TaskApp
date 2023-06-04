import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Board } from '../board/board.entity';
import { UUIDEntity } from '../abstract/uuid.entity';

@Entity('projects')
export class Project extends UUIDEntity {
  @Column()
  name: string;

  @Column()
  color: string;

  @ManyToMany(() => User)
  @JoinTable({ name: 'project_users' })
  users: User[];

  @OneToMany(() => Board, board => board.project)
  boards: Board[];

  delete() {
    this.deleted = true;
    this.boards.forEach((board) => board.delete());
  }
}
