import { Case } from '../schemas/case.schema';
import { CaseMetaDto } from '../dtos/case-meta.dto';
import { CaseResponseDto, ModifiedAreaDto, UpdatedCaseDto } from '../dtos/case-response.dto';

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
      voters: caseData.voters
    }
  }

  export function toUpdatedCaseDto(caseData: Case): UpdatedCaseDto {
    return {
      id: caseData._id.toString(),
      name: caseData.name,
      includedAreaTypes: caseData.includedAreaTypes,
      isClosed: caseData.isClosed,
      voters: caseData.voters
    }
  }

  export function toModifiedAreaDto(caseData: Case, lotNumber: string): ModifiedAreaDto {
    return {
      caseId: caseData._id.toString(),
      lotNumber: lotNumber,
      area: caseData.rawAreas.find(area => area.lotNumber === lotNumber).area
    }
  }
}
