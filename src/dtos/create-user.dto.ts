import { IsString } from 'class-validator';
import { Role } from '../enums/role';
import { IsRole } from '../validators/role.validator';

export class CreateUserDto {
  @IsString() username: string;
  @IsRole() role: Role;
}
