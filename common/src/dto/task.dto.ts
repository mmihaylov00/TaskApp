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
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
}

export const TASK_PRIORITIES = [
  TaskPriority.LOW,
  TaskPriority.NORMAL,
  TaskPriority.HIGH,
];
