import { Index, Column, PrimaryGeneratedColumn } from 'typeorm';

@Index(['id', 'deleted'])
export abstract class UUIDEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({default: false, nullable: false})
  deleted: boolean = false;
}
