import { Column, Entity, OneToOne, Generated, ManyToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { Project } from '../project/project.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  password?: string;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column()
  enabled: boolean = false;

  @Column()
  @Generated("uuid")
  invitationLink?: string;

  @Column({
    type: "enum",
    enum: Role
  })
  role: Role;

  @ManyToMany(() => Project)
  projects: Project[];

  @OneToOne(type => User, user => user.id, {
    cascade: true,
    onDelete: "CASCADE"
  })
  @JoinColumn()
  invitedBy?: User;
}
