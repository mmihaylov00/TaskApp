import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Board } from '../board/board.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  color: string;

  @ManyToMany(() => User)
  @JoinTable({ name: 'project_users' })
  users: User[];

  @OneToMany(() => Board, board => board.project)
  boards: Board[];
}
