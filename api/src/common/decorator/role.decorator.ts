import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/role.enum.js';

export const ROLES_KEY = 'roles';
export const Roles = (...role: Role[]) => SetMetadata(ROLES_KEY, role);
