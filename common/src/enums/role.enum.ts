export enum Role {
  DEVELOPER = 'DEVELOPER',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  ADMIN = 'ADMIN',
}
export const ROLES = [Role.DEVELOPER, Role.PROJECT_MANAGER, Role.ADMIN];
export const ROLE_COLORS = {
  [Role.ADMIN]: '#bb2124',
  [Role.PROJECT_MANAGER]: 'rgba(131, 58, 180, 1)',
  [Role.DEVELOPER]: '#a56ea3',
};
