import { createAction, createReducer, on, props } from '@ngrx/store';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { StageDto } from 'taskapp-common/dist/src/dto/stage.dto';

export interface BoardData {
  boardId: string;
  projectId: string;
  users: UserDetailsDto[];
  stages: StageDto[];
}

export const initialState: BoardData = {
  boardId: '',
  projectId: '',
  users: [],
  stages: [],
};

export const setBoardData = createAction(
  'Set Board State',
  props<Partial<BoardData>>(),
);

export const boardReducer = createReducer(
  initialState,
  on(setBoardData, (state, data) => {
    return {
      boardId: data.boardId || state.boardId,
      projectId: data.projectId || state.projectId,
      stages: data.stages || state.stages,
      users: data.users || state.users,
    };
  }),
);
