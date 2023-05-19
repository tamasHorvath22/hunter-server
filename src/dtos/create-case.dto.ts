import { IsNotEmptyString } from '../validators/not-empty-string';

export class CreateCaseDto {
  @IsNotEmptyString() name: string;
}
