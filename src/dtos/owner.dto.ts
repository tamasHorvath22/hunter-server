import { IsNumber } from 'class-validator';
import { IsNotEmptyString } from '../validators/not-empty-string';

export class OwnerDto {
  @IsNumber() quota: number;
  @IsNotEmptyString() type: string;
  @IsNotEmptyString() details: string;
}
