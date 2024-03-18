import { createAction, createReducer, on, props } from '@ngrx/store';

export interface NavData {
  nav: boolean;
}

const isActive = localStorage.getItem('nav');
export const initialState: NavData = {
  nav: isActive === undefined ? true : isActive === 'true',
};

export const setNavOpenState = createAction(
  'Change Nav Menu State',
  props<{ isOpen: boolean }>(),
);

export const navReducer = createReducer(
  initialState,
  on(setNavOpenState, (state, { isOpen }) => {
    localStorage.setItem('nav', !state.nav + '');
    return { nav: !state.nav };
  }),
);
