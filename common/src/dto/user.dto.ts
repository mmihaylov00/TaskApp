import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';

export interface CreateUserDto {
  firstName?: string;
  lastName?: string;
  projectIds?: string[];
  email: string;
  role: Role;
}

export interface SearchUserDto {
  name: string;
  userIds: string[];
}

export interface UserStatsDto {
  completedTasks: number;
  pendingTasks: number;
  createdTasks: number;
  overallCompletedTasks: number;
  overallPendingTasks: number;
  overallCreatedTasks: number;
  overallUnassignedTasks: number;
  taskBoards: {
    name: string;
    pendingTasks: number;
    completedTasks: number;
  }[];
  taskStages: { name: string; tasks: number; color: string }[];
}
