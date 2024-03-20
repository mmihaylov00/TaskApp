import { UserDetailsDto } from './auth.dto';
import { TaskPriority } from '../enums/task-priority.enum';
import { StageDto } from './stage.dto';

export interface TaskDto {
  id: string;
  title: string;
  description: any;
  stage: string;
  author: UserDetailsDto;
  priority?: TaskPriority;
  assignee?: UserDetailsDto;
  deadline?: Date;
}

export interface TaskDetailsDto {
  task: TaskDto;
  stages: StageDto[];
  users: UserDetailsDto[];
}

export interface CreateTaskDto {
  title: string;
  description: string;
  boardId: string;
  stage: string;
  priority?: TaskPriority;
  assignee?: string;
  deadline?: Date;
}

export interface MoveTaskDto {
  stageId: string;
  boardId: string;
  index: number;
}

export interface TaskMovedDto {
  taskId: string;
  oldStageId: string;
  index: number;
  newStageId: string;
}
