import { createAction, createReducer, on, props } from '@ngrx/store';
import { ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';

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
);
