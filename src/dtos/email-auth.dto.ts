import { IsNotEmptyString } from '../validators/not-empty-string';

export class EmailAuthDto {
  @IsNotEmptyString()
  emailHash: string;
}
