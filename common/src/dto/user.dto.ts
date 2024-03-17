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
