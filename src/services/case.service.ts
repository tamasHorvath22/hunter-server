import { Injectable } from '@nestjs/common';
import { CaseRepositoryService } from '../repositories/case.repository.service';
import { Area, Case, Motion, NewOwner, Voter } from '../schemas/case.schema';
import { CaseMetaDto } from '../dtos/case-meta.dto';
import { CaseMapper } from '../mappers/case.mapper';
import { CaseNoRightsException } from '../exceptions/case-no-rights.exception';
import { CaseResponseDto, ModifiedAreaDto, NewAreaDto, UpdatedCaseDto } from '../dtos/case-response.dto';
import {
  CreateAreaDto,
  CreateCaseDto,
  CreateMotionDto,
  DeleteVoterDto,
  ModifyAreaDto,
  UpdateCaseDto,
  UpdateVoterDto
} from '../dtos/case-request.dtos';
import { AreaNotFoundException } from '../exceptions/area-not-found.exception';
import { AreaAlreadyExistsException } from '../exceptions/area-already-exists.exception';
import { InvalidQuotaSumException } from '../exceptions/invalid-quota-sum';
import { UsernameTakenException } from '../exceptions/username-taken.exception';
import { InvalidDataException } from '../exceptions/invalid-data.exception';
import { LoggerType } from '../enums/logger-type';
import { LoggerService } from './logger.service';

@Injectable()
export class CaseService {

  constructor(
    private caseRepository: CaseRepositoryService,
    private loggerService: LoggerService
  ) {}

  async createCase(createCaseDto: CreateCaseDto, userId: string): Promise<CaseMetaDto[]> {
    const newCase: Case = {
      creator: userId,
      isClosed: false,
      isRegistrationClosed: false,
      voters: [],
      rawAreas: createCaseDto.areas.map(area => ({ ...area, isManuallyCreated: false })),
      name: createCaseDto.name,
      includedAreaTypes: createCaseDto.includedAreaTypes,
      motions: [],
      excludedVoters: [],
      excludedAreas: []
    };
    const savedCase = await this.caseRepository.createCase(newCase);
    this.loggerService.info(
      LoggerType.CASE_SERVICE,
      `Case creation success; case ID: ${savedCase._id.toString()}; case name: ${savedCase.name}`
    );
    return await this.getCases(userId);
  }

  async createArea(createAreaDto: CreateAreaDto, userId: string): Promise<NewAreaDto> {
    const caseData = await this.caseRepository.findCase(createAreaDto.caseId);
    if (caseData.creator !== userId) {
      this.invalidCaseAccessError(caseData._id.toString(), userId);
    }
    const existingLotNumbers = caseData.rawAreas.map(area => area.lotNumber);
    if (existingLotNumbers.includes(createAreaDto.lotNumber)) {
      this.loggerService.error(
        LoggerType.CASE_SERVICE,
        `Area already exists; case ID: ${createAreaDto.caseId}; lot number: ${createAreaDto.lotNumber}`
      );
      throw new AreaAlreadyExistsException();
    }
    if (!this.isQuotasSumValid(createAreaDto.owners)) {
      this.invalidQuotaSumError(createAreaDto.caseId);
    }
    const newArea: Area = {
      area: createAreaDto.area,
      lotNumber: createAreaDto.lotNumber,
      type: createAreaDto.type,
      groupByTypes: null,
      isManuallyCreated: true,
      owners: createAreaDto.owners
    };
    const addToVoterQuotas = createAreaDto.owners.filter(owner => owner.addToVoter);
    const addToVoter = !!addToVoterQuotas.length;
    let updatedVoter = JSON.parse(JSON.stringify(caseData.voters.find(voter => voter.id === createAreaDto.createdForVoter)));
    if (!updatedVoter) {
      this.loggerService.error(
        LoggerType.CASE_SERVICE,
        `No voter found; "createArea"; case ID: ${createAreaDto.caseId}; voter ID: ${createAreaDto.createdForVoter}`
      );
      throw new InvalidDataException();
    }
    if (addToVoter) {
      updatedVoter = {
        ...updatedVoter,
        areas: [
          ...updatedVoter.areas,
          {
            areaLotNumber: createAreaDto.lotNumber,
            quota: addToVoterQuotas.reduce((sum, owner) => sum + owner.quota, 0),
            includedTypes: null
          }
        ]
      };
    }

    const caseToSave = {
      rawAreas: [...caseData.rawAreas, newArea],
      voters: [...caseData.voters.filter(v => v.id !== createAreaDto.createdForVoter), updatedVoter]
    };

    const updatedCase = await this.caseRepository.updateCase(caseData._id, this.increaseCaseVersion(caseToSave, caseData.__v));
    this.loggerService.info(LoggerType.CASE_SERVICE, `Create area success; case ID: ${updatedCase._id.toString()}`);
    return CaseMapper.toNewAreaDto(updatedCase, createAreaDto.lotNumber, addToVoter ? createAreaDto.createdForVoter : null);
  }

  async updateArea(updateAreaDto: CreateAreaDto, userId: string): Promise<NewAreaDto> {
    const caseData = await this.caseRepository.findCase(updateAreaDto.caseId);
    if (caseData.creator !== userId) {
      this.invalidCaseAccessError(caseData._id.toString(), userId);
    }
    if (!this.isQuotasSumValid(updateAreaDto.owners)) {
      this.invalidQuotaSumError(updateAreaDto.caseId);
    }
    const area = caseData.rawAreas.find(area => area.lotNumber === updateAreaDto.lotNumber);
    if (!area) {
      this.loggerService.error(
        LoggerType.CASE_SERVICE,
        `No area found; "updatedArea"; case ID: ${updateAreaDto.caseId}; lot number: ${updateAreaDto.lotNumber}`
      );
      throw new InvalidDataException();
    }

    const updatedArea: Area = {
      ...area,
      area: updateAreaDto.area,
      owners: updateAreaDto.owners
    };

    const caseToSave = {
      rawAreas: [
        ...caseData.rawAreas.filter(area => area.lotNumber !== updateAreaDto.lotNumber),
        updatedArea
      ],
    };

    const updatedCase = await this.caseRepository.updateCase(caseData._id, this.increaseCaseVersion(caseToSave, caseData.__v));
    this.loggerService.info(LoggerType.CASE_SERVICE, `Area update success; case ID: ${updatedCase._id.toString()}`);
    return CaseMapper.toNewAreaDto(updatedCase, updateAreaDto.lotNumber, null);
  }

  async createMotion(createMotionDto: CreateMotionDto, userId: string): Promise<UpdatedCaseDto> {
    const caseData = await this.caseRepository.findCase(createMotionDto.caseId);
    if (caseData.creator !== userId) {
      this.invalidCaseAccessError(caseData._id.toString(), userId);
    }
    const newMotion: Motion = {
      name: createMotionDto.name,
      type: createMotionDto.type,
      voters: createMotionDto.voters,
      details: createMotionDto.details,
      id: createMotionDto.id,
      result: createMotionDto.result,
      approved: createMotionDto.approved,
      votersData: createMotionDto.votersData
    };
    const updatedMotions: Partial<Case> = {
      motions: [...caseData.motions, newMotion]
    };
    const updatedCase = await this.caseRepository.updateCase(caseData._id, this.increaseCaseVersion(updatedMotions, caseData.__v));
    this.loggerService.info(LoggerType.CASE_SERVICE, `Create motion success; case ID: ${updatedCase._id.toString()}`);
    return CaseMapper.toUpdatedCaseDto(updatedCase);
  }

  async updateCase(updateCaseDto: UpdateCaseDto, userId: string): Promise<UpdatedCaseDto> {
    const caseData = await this.caseRepository.findCase(updateCaseDto.id);
    if (caseData.creator !== userId) {
      this.invalidCaseAccessError(caseData._id.toString(), userId);
    }
    if (updateCaseDto.voters) {
      if (!this.areVotersNameUnique(updateCaseDto.voters)) {
        this.usernameTakenError(updateCaseDto.id, "updateCase");
      }
    }
    if (updateCaseDto.excludedAreas) {
      /** if any excluded area added previously to a voter, remove them */
      for (const lotNumber of updateCaseDto.excludedAreas) {
        for (const voter of caseData.voters) {
          voter.areas = voter.areas.filter(a => a.areaLotNumber !== lotNumber);
        }
      }
      updateCaseDto = {
        ...updateCaseDto,
        excludedAreas: [...caseData.excludedAreas, ...updateCaseDto.excludedAreas],
        voters: caseData.voters
      };
    }
    const updatedCase = await this.caseRepository.updateCase(caseData._id, this.increaseCaseVersion(updateCaseDto, caseData.__v));
    const dtoKeys = Object.keys(updateCaseDto).filter(key => !['id', 'type'].includes(key)).join(', ');
    this.loggerService.info(
      LoggerType.CASE_SERVICE,
      `Case update success; case ID: ${updatedCase._id.toString()}; modified keys: ${dtoKeys}`
    );
    return CaseMapper.toUpdatedCaseDto(updatedCase);
  }

  async updateVoter(updateVoterDto: UpdateVoterDto, userId: string): Promise<UpdatedCaseDto> {
    const caseData = await this.caseRepository.findCase(updateVoterDto.caseId);
    if (caseData.creator !== userId) {
      this.invalidCaseAccessError(caseData._id.toString(), userId);
    }
    if (!this.areVotersNameUnique(caseData.voters)) {
      this.usernameTakenError(caseData._id.toString(), 'updateVoter');
    }
    const voterToUpdate = caseData.voters.find(voter => voter.id === updateVoterDto.voterId);
    if (!voterToUpdate) {
      this.loggerService.error(
        LoggerType.CASE_SERVICE,
        `Voter not found; "updateVoter"; case ID: ${updateVoterDto.caseId}; voter ID: ${updateVoterDto.voterId}`
      );
      throw new InvalidDataException();
    }
    const updatedVoter: Voter = {
      ...voterToUpdate,
      name: updateVoterDto.name,
      company: updateVoterDto.company
    }
    const caseToUpdate: Partial<Case> = {
      voters: [
        ...caseData.voters.filter(voter => voter.id !== updateVoterDto.voterId),
        updatedVoter
      ]
    }
    const updatedCase = await this.caseRepository.updateCase(caseData._id, this.increaseCaseVersion(caseToUpdate, caseData.__v));
    this.loggerService.info(LoggerType.CASE_SERVICE, `Voter update success; case ID: ${updatedCase._id.toString()}`);
    return CaseMapper.toUpdatedCaseDto(updatedCase);
  }

  async deleteVoter(deleteVoterDto: DeleteVoterDto, userId: string): Promise<UpdatedCaseDto> {
    const caseData = await this.caseRepository.findCase(deleteVoterDto.caseId);
    if (caseData.creator !== userId) {
      this.invalidCaseAccessError(caseData._id.toString(), userId);
    }
    const caseToUpdate: Partial<Case> = {
      voters: caseData.voters.filter(voter => voter.id !== deleteVoterDto.voterId)
    }
    const updatedCase = await this.caseRepository.updateCase(caseData._id, this.increaseCaseVersion(caseToUpdate, caseData.__v));
    this.loggerService.info(LoggerType.CASE_SERVICE, `Delete voter success; case ID: ${updatedCase._id.toString()}`);
    return CaseMapper.toUpdatedCaseDto(updatedCase);
  }

  async deleteCase(deleteCaseDto: { caseId: string }, userId: string): Promise<CaseMetaDto[]> {
    const caseData = await this.caseRepository.findCase(deleteCaseDto.caseId);
    if (caseData.creator !== userId) {
      this.invalidCaseAccessError(caseData._id.toString(), userId);
    }
    await this.caseRepository.deleteCaseById(caseData._id);
    this.loggerService.info(LoggerType.CASE_SERVICE, `Delete case success; case ID: ${deleteCaseDto.caseId}`);
    return await this.getCases(userId);
  }

  async getCases(userId: string): Promise<CaseMetaDto[]> {
    const cases = await this.caseRepository.getUserCases(userId);
    this.loggerService.info(LoggerType.CASE_SERVICE, `Get cases meta success; user ID: ${userId}`);
    return cases.map(CaseMapper.toCaseMeta);
  }

  async modifyArea(modifyAreaDto: ModifyAreaDto, userId: string): Promise<ModifiedAreaDto> {
    const caseData = await this.caseRepository.findCase(modifyAreaDto.caseId);
    if (caseData.creator !== userId) {
      this.invalidCaseAccessError(caseData._id.toString(), userId);
    }
    const area = caseData.rawAreas.find(area => area.lotNumber === modifyAreaDto.lotNumber);
    if (!area) {
      this.loggerService.error(
        LoggerType.CASE_SERVICE,
        `Area not found; "modifyArea"; case ID: ${modifyAreaDto.caseId}; lot number: ${modifyAreaDto.lotNumber}`
      );
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
    const updatedCase = await this.caseRepository.modifyArea(caseData._id, updatedAreas, caseData.__v + 1);
    this.loggerService.info(LoggerType.CASE_SERVICE, `Modify area success; case ID: ${updatedCase._id.toString()}`);
    return CaseMapper.toModifiedAreaDto(updatedCase, modifyAreaDto.lotNumber);
  }

  async getCase(userId: string, caseId: string): Promise<CaseResponseDto> {
    const caseData = await this.caseRepository.findCase(caseId);
    if (caseData.creator !== userId) {
      this.invalidCaseAccessError(caseId, userId);
    }
    this.loggerService.info(LoggerType.CASE_SERVICE, `Get case success; case ID: ${caseId}`);
    return CaseMapper.toCaseDto(caseData);
  }

  private invalidCaseAccessError(caseId: string, userId: string): CaseNoRightsException {
    this.loggerService.error(
      LoggerType.CASE_SERVICE,
      `Invalid creator access error; case ID: ${caseId}; user ID: ${userId}`
    );
    throw new CaseNoRightsException();
  }

  private usernameTakenError(caseId: string, functionName: string): UsernameTakenException {
    this.loggerService.error(
      LoggerType.CASE_SERVICE,
      `Voter name already exists; "${functionName}"; case ID: ${caseId}`
    );
    throw new UsernameTakenException();
  }

  private invalidQuotaSumError(caseId: string): InvalidQuotaSumException {
    this.loggerService.error(LoggerType.CASE_SERVICE, `Area quota sum is not valid; case ID: ${caseId}`);
    throw new InvalidQuotaSumException();
  }

  private isQuotasSumValid(owners: NewOwner[]): boolean {
    const quotaSum = owners.reduce((quotaSum, owner) => quotaSum + owner.quota, 0);
    return quotaSum <= 100;
  }

  private areVotersNameUnique(voters: Voter[]): boolean {
    const uniqueVoters = new Set(voters.map(voter => voter.name.toLowerCase()));
    return uniqueVoters.size === voters.length;
  }

  // TODO I don't like this solution
  private increaseCaseVersion(updateCase: Partial<Case>, version: number): Partial<Case> {
    return { ...updateCase, __v: version + 1 };
  }
}
