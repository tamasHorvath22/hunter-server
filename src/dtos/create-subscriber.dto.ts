import { IsValidEmail } from '../validators/is-email';
import { IsNotEmptyString } from '../validators/not-empty-string';

export class CreateSubscriberDto {
  @IsValidEmail()
  @IsNotEmptyString()
  email: string;
}
