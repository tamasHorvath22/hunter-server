import { Role } from '../enums/role';

export interface UserType {
  role: Role;
  id: string;
  username: string;
}
