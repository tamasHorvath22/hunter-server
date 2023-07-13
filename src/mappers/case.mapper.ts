import { Case } from '../schemas/case.schema';
import { CaseMetaDto } from '../dtos/case-meta.dto';
import { CaseResponseDto, ModifiedAreaDto, NewAreaDto, UpdatedCaseDto } from '../dtos/case-response.dto';

export namespace CaseMapper {
  export function toCaseMeta(inputCase: Case): CaseMetaDto {
    return {
      name: inputCase.name,
      createdAt: inputCase.createdAt,
      id: inputCase._id.toString()
    }
  }

  export function toCaseDto(caseData: Case): CaseResponseDto {
    return {
      id: caseData._id.toString(),
      name: caseData.name,
      includedAreaTypes: caseData.includedAreaTypes,
      areas: caseData.rawAreas,
      creator: caseData.creator,
      isClosed: caseData.isClosed,
      isRegistrationClosed: caseData.isRegistrationClosed,
      voters: caseData.voters,
      motions: caseData.motions
    }
  }

  export function toUpdatedCaseDto(caseData: Case): UpdatedCaseDto {
    return {
      id: caseData._id.toString(),
      name: caseData.name,
      includedAreaTypes: caseData.includedAreaTypes,
      isClosed: caseData.isClosed,
      isRegistrationClosed: caseData.isRegistrationClosed,
      voters: caseData.voters,
      motions: caseData.motions
    }
  }

  export function toModifiedAreaDto(caseData: Case, lotNumber: string): ModifiedAreaDto {
    const area = caseData.rawAreas.find(area => area.lotNumber === lotNumber);
    return {
      caseId: caseData._id.toString(),
      lotNumber: lotNumber,
      area: area.area,
      areas: area.groupByTypes
    }
  }

  export function toNewAreaDto(caseData: Case, lotNumber: string, voterId: string): NewAreaDto {
    const updatedVoter = voterId ? caseData.voters.find(v => v.id === voterId) : null;
    return {
      id: caseData._id.toString(),
      updatedVoter: updatedVoter,
      newArea: caseData.rawAreas.find(a => a.lotNumber === lotNumber)
    }
  }
}
