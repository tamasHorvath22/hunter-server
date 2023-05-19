import { Role } from '../enums/role';
import { IsRole } from '../validators/role.validator';
import { IsNotEmptyString } from '../validators/not-empty-string';

export class CreateUserDto {
  @IsNotEmptyString
  username: string;

  @IsRole()
  role: Role;
}
