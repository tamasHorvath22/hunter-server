import { Area, Owner, Voter } from '../schemas/case.schema';
import { IsNotEmptyString } from '../validators/not-empty-string';
import { IsArray, IsBoolean, IsNumber, IsString, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCaseDto {
  @IsNotEmptyString() name: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => AreaRequestDto)
  areas: Area[];

  @IsArray()
  @IsString({ each: true })
  includedAreaTypes: string[];
}

export class AreaRequestDto {
  @IsNotEmptyString() lotNumber: string;

  @IsNumber() area: number;

  @IsNotEmptyString() type: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OwnerDto)
  owners: Owner[];
}

export class OwnerDto {
  @IsNumber() quota: number;
  @IsNotEmptyString() type: string;
  @IsNotEmptyString() details: string;
}

export class UpdateCaseDto {
  @IsNotEmptyString() id: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => VoterRequestDto)
  voters: Voter[];

  @IsArray()
  @IsString({ each: true })
  includedAreaTypes: string[];

  @IsBoolean() isClosed: boolean;

  @IsNotEmptyString() name: string;
}

export class VoterRequestDto {
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => VoterAreaRequestDto)
  areas: VoterAreaRequestDto[];

  @IsNotEmptyString() name: string;
  @IsNotEmptyString() id: string;
  @IsString() company: string;
}

export class VoterAreaRequestDto {
  @IsNotEmptyString() areaId: string;

  @IsNumber()
  @Max(1)
  quota: number;
}
