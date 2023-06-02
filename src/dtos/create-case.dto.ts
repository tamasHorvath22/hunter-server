import { IsNotEmptyString } from '../validators/not-empty-string';
import { Area } from '../schemas/case.schema';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AreaDto } from './aera.dto';

export class CreateCaseDto {
  @IsNotEmptyString() name: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => AreaDto)
  areas: Area[];

  @IsArray()
  @IsString({ each: true })
  includedAreaTypes: string[];
}
