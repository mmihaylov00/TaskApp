import { UUIDEntity } from '../uuid.entity';
import { User } from './user.entity';
import { Board } from './board.entity';
import { ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';
import { BelongsToMany, Column, HasMany, Table } from 'sequelize-typescript';
import { UserProject } from './user-project.entity';
import { Task } from './task.entity';

@Table({ paranoid: true })
export class Project extends UUIDEntity {
  @Column
  declare name: string;

  @Column
  declare color: string;

  @Column
  declare icon: string;

  @BelongsToMany(() => User, () => UserProject)
  declare users: User[];

  @HasMany(() => Board)
  declare boards: Board[];

  @HasMany(() => Task)
  declare tasks: Task[];

  toDto(): ProjectDto {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      icon: this.icon,
      boards: this.boards?.map((value) => value.toDto()),
    };
  }
}
