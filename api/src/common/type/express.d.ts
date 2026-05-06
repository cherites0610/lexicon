import { Role } from '../common/enum/role.enum.js';

declare global {
  namespace Express {
    interface User {
      jti: string;
      id: string;
      role: Role;
      email: string;
    }

    interface Request {
      user: User;
    }
  }
}
