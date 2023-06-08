export interface CaseResponseDto {
  name: string;
  id: string;
  creator: string;
  isClosed: boolean;
  areas: AreaResponseDto[];
  voters: VoterResponseDto[];
  includedAreaTypes: string[];
}

export interface AreaResponseDto {
  lotNumber: string;
  owners: OwnerResponseDto[];
  area: number;
  type: string;
  id: string;
}

export interface OwnerResponseDto {
  quota: number;
  type: string;
  details: string;
}

export interface VoterResponseDto {
  areas: VoterAreaResponseDto[];
  name: string;
  company: string;
  id: string;
}

export interface VoterAreaResponseDto {
  areaId: string;
  quota: number;
}

export interface UpdatedCaseDto {
  id: string;
  name: string;
  isClosed: boolean;
  voters: VoterResponseDto[];
  includedAreaTypes: string[];
}
