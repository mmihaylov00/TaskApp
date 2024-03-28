import { UserDetailsDto } from './auth.dto';
import { TaskPriority } from '../enums/task-priority.enum';
import { StageDto } from './stage.dto';
import { AttachmentDataDto } from './attachment.dto';

export interface TaskDto {
  id: string;
  title: string;
  description: any;
  stage: string;
  createdAt?: Date;
  updatedAt?: Date;
  author: UserDetailsDto;
  priority?: TaskPriority;
  assignee?: UserDetailsDto;
  updatedBy?: UserDetailsDto;
  deadline?: Date;
  attachments?: AttachmentDataDto[];
  thumbnail?: string;
  completed?: boolean;
}

export interface TaskDetailsDto {
  task: TaskDto;
  stages: StageDto[];
  users: UserDetailsDto[];
}

export interface CreateTaskDto {
  title: string;
  description: string;
  stage: string;
  boardId?: string;
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

export interface TaskRemovedDto {
  taskId: string;
  stageId: string;
}
