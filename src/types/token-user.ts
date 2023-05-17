import { Role } from '../enums/role';

export interface TokenUser {
  userId: string,
  username: string,
  role: Role,
  iat: number,
  exp: number
}
