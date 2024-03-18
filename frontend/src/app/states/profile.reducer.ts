import { createAction, createReducer, on, props } from '@ngrx/store';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';

export interface ProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: UserStatus;
  role?: Role;
}

export const initialState: ProfileData = {};

export const setProfileData = createAction(
  'Set Profile Data',
  props<{ firstName; lastName; role; email; status }>(),
);

export const profileReducer = createReducer(
  initialState,
  on(setProfileData, (state, data: ProfileData) => data),
);
