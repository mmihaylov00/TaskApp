import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';

export interface LoginRequestDto {
  email: string;
  password: string;
}
export interface LoginResponseDto {
  token: string;
  status: UserStatus;
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
export interface ProfileSetupDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}
