import { BoardDto } from './board.dto';

export interface ProjectDto {
  id: string;
  name: string;
  color: string;
  boards: BoardDto[];
  compact?: boolean;
}

export interface CreateProjectDto {
  name: string;
  color: string;
}
