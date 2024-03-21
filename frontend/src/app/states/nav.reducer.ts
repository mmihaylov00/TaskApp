import { createAction, createReducer, on, props } from '@ngrx/store';

export interface NavData {
  nav: boolean;
  task: boolean;
}

const isActive = localStorage.getItem('nav');
console.log(isActive);
export const initialState: NavData = {
  nav: isActive === null ? true : isActive === 'true',
  task: false,
};

export const setNavOpenState = createAction(
  'Change Nav Menu State',
  props<{ isOpen: boolean }>(),
);

export const toggleNavOpenState = createAction(
  'Toggle Nav Menu State',
  props<any>(),
);

export const setTaskOpenState = createAction(
  'Change Task Menu State',
  props<{ isOpen: boolean }>(),
);

export const navReducer = createReducer(
  initialState,
  on(toggleNavOpenState, (state, {}) => {
    localStorage.setItem('nav', !state.nav + '');
    return { nav: !state.nav, task: state.task };
  }),
  on(setNavOpenState, (state, { isOpen }) => {
    localStorage.setItem('nav', isOpen + '');
    return { nav: isOpen, task: state.task };
  }),
  on(setTaskOpenState, (state, { isOpen }) => {
    return { nav: state.nav, task: isOpen };
  }),
);
