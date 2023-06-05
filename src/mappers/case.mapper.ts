import { Case } from '../schemas/case.schema';
import { CaseMetaDto } from '../dtos/case-meta.dto';

export namespace CaseMapper {
  export function toCaseMeta(inputCase: Case): CaseMetaDto {
    return {
      name: inputCase.name,
      createdAt: inputCase.createdAt
    }
  }
}
