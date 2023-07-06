import { TypeAndArea } from '../schemas/case.schema';

export interface CaseResponseDto {
  name: string;
  id: string;
  creator: string;
  isClosed: boolean;
  isRegistrationClosed: boolean;
  areas: AreaResponseDto[];
  voters: VoterResponseDto[];
  includedAreaTypes: string[];
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

export interface UpdatedCaseDto {
  id: string;
  name: string;
  isClosed: boolean;
  isRegistrationClosed: boolean;
  voters: VoterResponseDto[];
  includedAreaTypes: string[];
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
