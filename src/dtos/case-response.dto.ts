import { Motion, TypeAndArea } from '../schemas/case.schema';

export interface UpdatedCaseDto {
  id: string;
  name: string;
  isClosed: boolean;
  isRegistrationClosed: boolean;
  voters: VoterResponseDto[];
  includedAreaTypes: string[];
  motions: Motion[];
  excludedVoters: string[];
  excludedAreas: string[];
}

export interface CaseResponseDto extends UpdatedCaseDto {
  creator: string;
  areas: AreaResponseDto[];
}

export interface AreaResponseDto {
  lotNumber: string;
  owners: OwnerResponseDto[];
  area: number;
  type: string;
  isManuallyCreated: boolean;
}

export interface OwnerResponseDto {
  quota: number;
  type: string;
  details: string;
  name?: string;
  address?: string;
  motherName?: string;
}

export interface VoterResponseDto {
  areas: VoterAreaResponseDto[];
  name: string;
  company: string;
  id: string;
}

export interface VoterAreaResponseDto {
  areaLotNumber: string;
  quota: number;
}

export interface ModifiedAreaDto {
  caseId: string;
  lotNumber: string;
  area: number;
  areas: TypeAndArea[];
}

export interface NewAreaDto {
  id: string;
  updatedVoter: VoterResponseDto;
  newArea: AreaResponseDto;
}
