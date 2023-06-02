import { Owner } from '../schemas/case.schema';
import { IsNotEmptyString } from '../validators/not-empty-string';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OwnerDto } from './owner.dto';

export class AreaDto {
  @IsNotEmptyString() lotNumber: string;

  @IsNumber() area: number;

  @IsNotEmptyString() type: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OwnerDto)
  owners: Owner[];
}
