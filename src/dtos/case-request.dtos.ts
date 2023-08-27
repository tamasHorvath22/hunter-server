import { Area, NewOwner, Owner, TypeAndArea, Voter, VoterArea, VoterData } from '../schemas/case.schema';
import { IsNotEmptyString } from '../validators/not-empty-string';
import { IsArray, IsBoolean, IsMongoId, IsNumber, IsString, Max, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AreAreasByGroup } from '../validators/areas-by-group.validator';
import { MotionType } from '../enums/motion-type';
import { IsMotionType } from '../validators/motion-type.validator';
import { AreMotionVoters, IsVoteType } from '../validators/motion-voters.validator';
import { Response } from '../enums/response';
import { VoteType } from '../enums/vote-type';

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

  @ValidateIf((object, value) => value)
  @IsString()
  name: string;

  @ValidateIf((object, value) => value)
  @IsString()
  address: string;

  @ValidateIf((object, value) => value)
  @IsString()
  motherName: string;
}

export class UpdateCaseDto {
  @IsMongoId()
  @IsNotEmptyString()
  id: string;

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

  @ValidateIf((object, value) => value)
  @IsArray()
  @IsString({ each: true })
  excludedVoters: string[];

  @ValidateIf((object, value) => value)
  @IsArray()
  @IsString({ each: true })
  excludedAreas: string[];
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
  @IsMongoId()
  @IsNotEmptyString()
  caseId: string;

  @IsNotEmptyString() lotNumber: string;

  @IsNumber() area: number;

  @IsNotEmptyString() type: string;

  @IsNotEmptyString() createdForVoter: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => NewAreaOwnerDto)
  owners: NewOwner[];
}

// TODO delete?
export class NewAreaOwnerDto extends OwnerDto {
  addToVoter: boolean;
}

export class CreateMotionDto {
  @IsNotEmptyString() name: string;
  @IsNotEmptyString() details: string;
  @IsNotEmptyString() id: string;

  @IsMongoId()
  @IsNotEmptyString()
  caseId: string;

  @AreMotionVoters({ message: Response.INVALID_DATA_TYPE }) voters: Record<string, VoteType>;
  @IsMotionType({ message: Response.INVALID_MOTION_TYPE }) type: MotionType;
  @IsNumber() result;
  @IsBoolean() approved;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => VoterDataDto)
  votersData: VoterData[];
}

export class VoterDataDto {
  @IsNotEmptyString() voterId: string;
  @IsNotEmptyString() voterName: string;
  @IsBoolean() votedForIt: boolean;
  @IsVoteType() value: VoteType;
}

export class DeleteVoterDto {
  @IsMongoId()
  @IsNotEmptyString()
  caseId: string;

  @IsNotEmptyString() voterId: string;
}

export class UpdateVoterDto extends DeleteVoterDto {
  @IsNotEmptyString() name: string;
  company: string;
}
