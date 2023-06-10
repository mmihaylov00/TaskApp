import { TaskDto } from './task.dto';

export interface StageDto {
  id: string;
  name: string;
  color: string;
  tasks: TaskDto[]
}

export interface ManageStageDto {
  name: string;
  color: string;
  boardId: string;
}
