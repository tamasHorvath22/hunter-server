import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCaseDto } from '../dtos/create-case.dto';
import { CaseRepositoryService } from '../repositories/case.repository.service';
import { Response } from '../enums/response';
import { UpdateCaseDto } from '../dtos/update-case.dto';
import { Case } from '../schemas/case.schema';
import { CaseMetaDto } from '../dtos/case-meta.dto';
import { CaseMapper } from '../mappers/case.mapper';

@Injectable()
export class CaseService {

  constructor(
    private caseRepository: CaseRepositoryService
  ) {}

  async createCase(createCaseDto: CreateCaseDto, userId: string): Promise<CaseMetaDto[]> {
    const newCase: Case = {
      creator: userId,
      isClosed: false,
      voters: [],
      rawAreas: createCaseDto.areas,
      name: createCaseDto.name,
      includedAreaTypes: createCaseDto.includedAreaTypes
    };
    const success = await this.caseRepository.createCase(newCase);
    if (!success) {
      throw new HttpException(Response.CASE_CREATE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return this.getCases(userId);
  }

  async updateCase(updateCaseDto: UpdateCaseDto, userId: string): Promise<void> {
    console.warn(updateCaseDto);
  }

  async getCases(userId: string): Promise<CaseMetaDto[]> {
    const cases = await this.caseRepository.getUserCases(userId);
    if (!cases) {
      return [];
    }
    return cases.map(CaseMapper.toCaseMeta);
  }
}
