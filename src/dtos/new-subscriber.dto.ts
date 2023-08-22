import { IsNotEmptyString } from '../validators/not-empty-string';
import { IsValidEmail } from '../validators/is-email';

export class NewSubscriberDto {
  @IsValidEmail()
  @IsNotEmptyString()
  email: string;
}
