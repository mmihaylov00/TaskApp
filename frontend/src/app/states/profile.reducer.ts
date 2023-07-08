import { createAction, createReducer, on, props } from '@ngrx/store';

export interface ProfileData {
  firstName?: string;
  lastName?: string;
  role?: string;
}

export const initialState: ProfileData = {};

export const setProfileData = createAction(
  'Set Profile Data',
  props<{ firstName; lastName; role }>(),
);

export const profileReducer = createReducer(
  initialState,
  on(setProfileData, (state, data: ProfileData) => data),
);
