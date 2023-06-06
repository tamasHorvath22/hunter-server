import { Case } from '../schemas/case.schema';
import { CaseMetaDto } from '../dtos/case-meta.dto';
import { CaseDto } from '../dtos/case.dto';

export namespace CaseMapper {
  export function toCaseMeta(inputCase: Case): CaseMetaDto {
    return {
      name: inputCase.name,
      createdAt: inputCase.createdAt,
      id: inputCase._id.toString()
    }
  }

  export function toCaseDto(caseData: Case): CaseDto {
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
}
