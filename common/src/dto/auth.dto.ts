import { Role } from '../enums/role.enum';

export interface LoginRequestDto {
  email: string;
  password: string;
}
export interface LoginResponseDto extends UserDetailsDto {
  token: string;
}

export interface UserDetailsDto {
  firstName: string;
  lastName: string;
  role: Role;
  token?: string;
}
