import { IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../enums/role';
import { IsRole } from '../validators/role.validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsRole()
  @IsNotEmpty()
  role: Role;
}
