import { IsValidEmail } from '../validators/is-email';
import { IsNotEmptyString } from '../validators/not-empty-string';

export class EmailAuthDto {
  @IsValidEmail()
  @IsNotEmptyString()
  email: string;
}
