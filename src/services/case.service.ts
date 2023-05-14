import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCaseDto } from '../dtos/create-case.dto';
import { CaseRepositoryService } from '../repositories/case.repository.service';
import { Response } from '../enums/response';

@Injectable()
export class CaseService {

  constructor(
    private caseRepository: CaseRepositoryService
  ) {}

  async createCase(createCaseDto: CreateCaseDto, userId: string): Promise<void> {
    const success = await this.caseRepository.createCase(createCaseDto.name, userId);
    if (!success) {
      throw new HttpException(Response.CASE_CREATE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
