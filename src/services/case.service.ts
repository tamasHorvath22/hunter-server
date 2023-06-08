import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CaseRepositoryService } from '../repositories/case.repository.service';
import { Response } from '../enums/response';
import { Case } from '../schemas/case.schema';
import { CaseMetaDto } from '../dtos/case-meta.dto';
import { CaseMapper } from '../mappers/case.mapper';
import { CaseNoRightsException } from '../exceptions/case-no-rights.exception';
import { CaseNotFoundException } from '../exceptions/case-not-found.exception';
import { CaseResponseDto, UpdatedCaseDto } from '../dtos/case-response.dto';
import { CreateCaseDto, UpdateCaseDto } from '../dtos/case-request.dtos';

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

  async updateCase(updateCaseDto: UpdateCaseDto, userId: string): Promise<UpdatedCaseDto> {
    const caseData = await this.caseRepository.getCase(updateCaseDto.id);
    if (!caseData || caseData.creator !== userId) {
      throw new CaseNotFoundException();
    }
    const updatedCase = await this.caseRepository.updateCase(caseData._id, updateCaseDto);
    return CaseMapper.toUpdatedCaseDto(updatedCase);
  }

  async getCases(userId: string): Promise<CaseMetaDto[]> {
    const cases = await this.caseRepository.getUserCases(userId);
    if (!cases) {
      return [];
    }
    return cases.map(CaseMapper.toCaseMeta);
  }

  async getCase(userId: string, caseId: string): Promise<CaseResponseDto> {
    const caseData = await this.caseRepository.getCase(caseId);
    if (!caseData) {
      throw new CaseNotFoundException();
    }
    if (caseData.creator !== userId) {
      throw new CaseNoRightsException();
    }
    return CaseMapper.toCaseDto(caseData);
  }
}
