import { BoardDto } from './board.dto';

export interface ProjectDto {
  id: string;
  name: string;
  color: string;
  icon: string;
  boards: BoardDto[];
  compact?: boolean;
}

export interface CreateProjectDto {
  name: string;
  color: string;
  icon: string;
  userIds: string[];
}

export interface ProjectStatsDto {
  stages: {
    name: string;
    tasks: number;
  }[];
  boards: {
    id: string;
    pendingTasks: number;
    completedTasks: number;
  }[];
}
