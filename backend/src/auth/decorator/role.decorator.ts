import { SetMetadata } from '@nestjs/common';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
