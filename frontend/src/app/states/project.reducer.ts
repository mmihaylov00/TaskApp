import { createAction, createReducer, on, props } from '@ngrx/store';
import { ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';
import { BoardDto } from 'taskapp-common/dist/src/dto/board.dto';

export interface ProjectData {
  projects: ProjectDto[];
}

export const initialState: ProjectData = {
  projects: JSON.parse(localStorage.getItem('projects') || '[]'),
};

export const setProjectState = createAction(
  'Change Projects',
  props<{ projects: ProjectDto[] }>(),
);

export const addProject = createAction(
  'Add Project',
  props<{ project: ProjectDto }>(),
);

export const updateProject = createAction(
  'Update Project',
  props<{ project: ProjectDto }>(),
);

export const addBoard = createAction('Add Board', props<{ board: BoardDto }>());
export const updateBoard = createAction(
  'Update Board',
  props<{ board: BoardDto }>(),
);
export const removeBoard = createAction(
  'Remove Board',
  props<{ board: BoardDto }>(),
);

export const projectReducer = createReducer(
  initialState,
  on(setProjectState, (state, { projects }) => {
    localStorage.setItem('projects', JSON.stringify(projects));
    return { projects };
  }),
  on(addProject, (state, { project }) => {
    const projects = [...state.projects, project].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    localStorage.setItem('projects', JSON.stringify(projects));
    return { projects };
  }),
  on(addBoard, (state, { board }) => {
    const projects = [...state.projects];
    const index = projects.findIndex(
      (project) => project.id === board.projectId,
    );

    const project = { ...projects.splice(index, 1)[0] };
    project.boards = [...project.boards, board].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    projects.splice(index, 0, project);

    localStorage.setItem('projects', JSON.stringify(projects));
    return { projects };
  }),
  on(removeBoard, (state, { board }) => {
    const projects = [...state.projects];
    const index = projects.findIndex(
      (project) => project.id === board.projectId,
    );

    const project = { ...projects.splice(index, 1)[0] };

    const boardIndex = project.boards.findIndex((b) => b.id === board.id);
    const boards = [...project.boards];
    boards.splice(boardIndex, 1);

    project.boards = [...boards].sort((a, b) => a.name.localeCompare(b.name));
    projects.splice(index, 0, project);

    localStorage.setItem('projects', JSON.stringify(projects));
    return { projects };
  }),
  on(updateBoard, (state, { board }) => {
    const projects = [...state.projects];
    const index = projects.findIndex(
      (project) => project.id === board.projectId,
    );

    const project = { ...projects.splice(index, 1)[0] };

    const boardIndex = project.boards.findIndex((b) => b.id === board.id);
    const boards = [...project.boards];
    boards.splice(boardIndex, 1);

    project.boards = [...boards, board].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    projects.splice(index, 0, project);

    localStorage.setItem('projects', JSON.stringify(projects));
    return { projects };
  }),
  on(updateProject, (state, { project }) => {
    const projects = [...state.projects];
    const index = projects.findIndex((p) => p.id === project.id);

    const p = { ...projects.splice(index, 1)[0] };
    p.name = project.name;
    p.color = project.color;
    projects.splice(index, 0, p);

    localStorage.setItem('projects', JSON.stringify(projects));
    return { projects };
  }),
);
