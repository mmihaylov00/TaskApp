import { UserDetailsDto } from './auth.dto';

export interface TaskDto {
  id: string;
  title: string;
  description: string;
  priority?: TaskPriority;
  author: UserDetailsDto;
  assignee?: UserDetailsDto;
  deadline?: Date;
}

export enum TaskPriority {
  LOW,
  NORMAL,
  HIGH,
}
