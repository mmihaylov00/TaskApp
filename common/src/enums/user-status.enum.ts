export enum UserStatus {
  INVITED = 'INVITED',
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}
export const USER_STATUSES = [
  UserStatus.INVITED,
  UserStatus.ACTIVE,
  UserStatus.DISABLED,
];
export const USER_STATUS_COLORS = {
  [UserStatus.INVITED]: '#a56ea3',
  [UserStatus.ACTIVE]: 'rgba(131, 58, 180, 1)',
  [UserStatus.DISABLED]: '#aaaaaa',
};
