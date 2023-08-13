import { createAction, createReducer, on, props } from '@ngrx/store';
import { ProfileData } from './profile.reducer';

export interface PopupData {
  profile: boolean;
}

export const initialState: PopupData = { profile: false };

export const setProfileOpenState = createAction(
  'Change Profile Menu State',
  props<{ isOpen: boolean }>(),
);

export const popupReducer = createReducer(
  initialState,
  on(setProfileOpenState, (state, { isOpen }) => {
    return { profile: isOpen };
  }),
);
