export interface BoardDto {
  id: string;
  name: string;
  color: string;
  projectId: string;
}

export interface CreateBoardDto {
  projectId: string;
  name: string;
  color: string;
}

export interface UpdateBoardDto {
  name: string;
  color: string;
}
