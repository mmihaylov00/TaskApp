import { ManageStageDto, StageDto } from './stage.dto';

export interface BoardDto {
  id: string;
  name: string;
  color: string;
  projectId: string;
  stages?: StageDto[];
}

export interface CreateBoardDto {
  projectId: string;
  name: string;
  color: string;
  stages: ManageStageDto[];
}

export interface UpdateBoardDto {
  name: string;
  color: string;
  stages: ManageStageDto[];
}
