import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CaseRepositoryService } from '../repositories/case.repository.service';
import { Response } from '../enums/response';
import { Area, Case, Voter } from '../schemas/case.schema';
import { CaseMetaDto } from '../dtos/case-meta.dto';
import { CaseMapper } from '../mappers/case.mapper';
import { CaseNoRightsException } from '../exceptions/case-no-rights.exception';
import { CaseNotFoundException } from '../exceptions/case-not-found.exception';
import { CaseResponseDto, ModifiedAreaDto, UpdatedCaseDto } from '../dtos/case-response.dto';
import { CreateAreaDto, CreateCaseDto, ModifyAreaDto, UpdateCaseDto } from '../dtos/case-request.dtos';
import { AreaNotFoundException } from '../exceptions/area-not-found.exception';
import { AreaAlreadyExistsException } from '../exceptions/area-already-exists.exception';

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

  async createArea(createAreaDto: CreateAreaDto, userId: string): Promise<any> {
    const caseData = await this.caseRepository.getCase(createAreaDto.caseId);
    if (!caseData || caseData.creator !== userId) {
      throw new CaseNotFoundException();
    }
    const existingLotNumbers = caseData.rawAreas.map(area => area.lotNumber);
    if (existingLotNumbers.includes(createAreaDto.lotNumber)) {
      throw new AreaAlreadyExistsException();
    }
    const newArea: Area = {
      area: createAreaDto.area,
      lotNumber: createAreaDto.lotNumber,
      type: createAreaDto.type,
      groupByTypes: null,
      owners: createAreaDto.owners.map(owner => ({
        id: owner.id,
        type: owner.ownerType,
        details: owner.details,
        quota: owner.quota
      }))
    };
    const addToVoterQuotas = createAreaDto.owners.filter(owner => owner.addToVoter);
    const addToVoter = !!addToVoterQuotas.length;
    let updatedVoter: Voter;
    if (addToVoter) {
      const voter = caseData.voters.find(voter => voter.id === createAreaDto.createdForVoter);
      updatedVoter = {
        ...voter,
        areas: [
          ...voter.areas,
          {
            areaLotNumber: createAreaDto.lotNumber,
            quota: addToVoterQuotas.reduce((sum, owner) => sum + owner.quota, 0)
          }
        ]
      };
    }
    const caseToSave: Partial<Case> = {
      voters: [...caseData.voters.filter(v => v.id !== createAreaDto.createdForVoter), updatedVoter],
      rawAreas: [
        ...caseData.rawAreas,
        newArea
      ]
    };
    const updatedCase = await this.caseRepository.updateCase(caseData._id, caseToSave);
    return CaseMapper.toNewAreaDto(updatedCase, createAreaDto.lotNumber, addToVoter ? createAreaDto.createdForVoter : null);
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

  async modifyArea(modifyAreaDto: ModifyAreaDto, userId: string): Promise<ModifiedAreaDto> {
    const caseData = await this.caseRepository.getCase(modifyAreaDto.caseId);
    if (!caseData || caseData.creator !== userId) {
      throw new CaseNotFoundException();
    }
    const area = caseData.rawAreas.find(area => area.lotNumber === modifyAreaDto.lotNumber);
    if (!area) {
      throw new AreaNotFoundException();
    }
    const modifiedArea: Area = {
      ...area,
      area: modifyAreaDto.area ? modifyAreaDto.area : area.area,
      groupByTypes: modifyAreaDto.areas
        ? area.groupByTypes.map(group => ({ ...group, area: modifyAreaDto.areas[group.type] }))
        : null
    };
    const updatedAreas = [
      ...caseData.rawAreas.filter(area => area.lotNumber !== modifyAreaDto.lotNumber),
      modifiedArea
    ];
    const updatedCase = await this.caseRepository.modifyArea(caseData._id, updatedAreas);
    return CaseMapper.toModifiedAreaDto(updatedCase, modifyAreaDto.lotNumber);
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
