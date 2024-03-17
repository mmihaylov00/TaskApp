import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';

export interface LoginRequestDto {
  email: string;
  password: string;
}
export interface LoginResponseDto extends UserDetailsDto {
  token: string;
}

export interface UserDetailsDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  role: Role;
  token?: string;
}
