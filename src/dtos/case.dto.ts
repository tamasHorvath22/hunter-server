export interface CaseDto {
  name: string;
  id: string;
  creator: string;
  isClosed: boolean;
  areas: AreaDto[];
  voters: VoterDto[];
  includedAreaTypes: string[];
}

export interface AreaDto {
  lotNumber: string;
  owners: OwnerDto[];
  area: number;
  type: string;
  id: string;
}

export interface VoterAreaDto extends AreaDto {
  quota: number;
  isEligibleToVote: boolean;
}

export interface OwnerDto {
  quota: number;
  type: string;
  details: string;
}

export class VoterDto {
  areas: VoterAreaDto[];
  name: string;
  company: string;
  id: string;
}
