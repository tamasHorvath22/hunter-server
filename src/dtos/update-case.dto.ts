import { IsNotEmptyString } from '../validators/not-empty-string';
import { Voter } from '../schemas/case.schema';
import { IsArray, IsString } from 'class-validator';

export class UpdateCaseDto {
  @IsNotEmptyString() id: string;

  // TODO validation - and add fields if needed
  voters: Voter[];

  @IsArray()
  @IsString({ each: true })
  includedAreaTypes: string[];
}
