import { IsNotEmptyString } from '../validators/not-empty-string';

export class LoginDto {
  @IsNotEmptyString() username: string;
  @IsNotEmptyString() password: string;
}
