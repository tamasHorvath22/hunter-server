import { Area, NewOwner, Owner, TypeAndArea, Voter, VoterArea } from '../schemas/case.schema';
import { IsNotEmptyString } from '../validators/not-empty-string';
import { IsArray, IsBoolean, IsNumber, IsString, Max, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AreAreasByGroup } from '../validators/areas-by-group.validator';

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

  @ValidateIf((object, value) => value)
  @IsNumber()
  area: number;

  @ValidateIf((object, value) => value)
  @IsNotEmptyString()
  type: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OwnerDto)
  owners: Owner[];

  @ValidateIf((object, value) => value)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TypeAndAreaDto)
  groupByTypes: TypeAndArea[];
}

export class TypeAndAreaDto {
  @IsNumber()
  area: number;

  @IsNotEmptyString()
  type: string;
}

export class OwnerDto {
  @IsNotEmptyString() type: string;
  @IsNotEmptyString() details: string;
  @IsNumber() quota: number;
  @IsNotEmptyString() id: string;
}

export class UpdateCaseDto {
  @IsNotEmptyString() id: string;

  @ValidateIf((object, value) => value)
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => VoterRequestDto)
  voters: Voter[];

  @ValidateIf((object, value) => value)
  @IsArray()
  @IsString({ each: true })
  includedAreaTypes: string[];

  @ValidateIf((object, value) => value)
  @IsBoolean()
  isClosed: boolean;

  @ValidateIf((object, value) => value)
  @IsBoolean()
  isRegistrationClosed: boolean;

  @ValidateIf((object, value) => value)
  @IsNotEmptyString()
  name: string;
}

export class VoterRequestDto {
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => VoterAreaRequestDto)
  areas: VoterArea[];

  @IsNotEmptyString() name: string;
  @IsNotEmptyString() id: string;
  @IsString() company: string;
}

export class VoterAreaRequestDto {
  @IsNotEmptyString() areaLotNumber: string;

  @IsNumber()
  @Max(100)
  quota: number;

  @ValidateIf((object, value) => value)
  @IsArray()
  @IsString({ each: true })
  includedTypes: string[];
}

export class ModifyAreaDto {
  @IsNotEmptyString() caseId: string;

  @IsNotEmptyString() lotNumber: string;

  @ValidateIf((object, value) => value)
  @IsNumber()
  area: number;

  @ValidateIf((object, value) => value)
  @AreAreasByGroup()
  areas: Record<string, number>;
}

export class CreateAreaDto {
  @IsNotEmptyString() caseId: string;

  @IsNotEmptyString() lotNumber: string;

  @IsNumber() area: number;

  @IsNotEmptyString() type: string;

  @IsNotEmptyString() createdForVoter: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => NewAreaOwnerDto)
  owners: NewOwner[];
}

export class NewAreaOwnerDto {
  @IsNotEmptyString() details: string;
  @IsNumber() quota: number;
  @IsNotEmptyString() id: string;
  addToVoter?: boolean;
  @IsNotEmptyString() type: string;
}

