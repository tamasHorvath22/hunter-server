import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RoleGuard } from "../guards/role-guard";
import { JwtTokenDecoder } from '../decorators/jwt-token.decoder';
import { CaseService } from '../services/case.service';
import { CaseMetaDto } from '../dtos/case-meta.dto';
import { TokenUser } from '../types/token-user';
import { CaseResponseDto, UpdatedCaseDto } from '../dtos/case-response.dto';
import { CreateCaseDto, UpdateCaseDto } from '../dtos/case-request.dtos';

@Controller('/api')
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Post('/case')
  @UseGuards(RoleGuard())
  async createCase(
    @Body() createCaseDto: CreateCaseDto,
    @JwtTokenDecoder() user: TokenUser
  ): Promise<CaseMetaDto[]> {
    return this.caseService.createCase(createCaseDto, user.userId);
  }

  @Put('/case')
  @UseGuards(RoleGuard())
  async updateCase(
    @Body() updateCaseDto: UpdateCaseDto,
    @JwtTokenDecoder() user: TokenUser
  ): Promise<UpdatedCaseDto> {
    return this.caseService.updateCase(updateCaseDto, user.userId);
  }

  @Get('/cases')
  @UseGuards(RoleGuard())
  async getCases(@JwtTokenDecoder() user: TokenUser): Promise<CaseMetaDto[]> {
    return this.caseService.getCases(user.userId);
  }

  @Get('/case/:caseId')
  @UseGuards(RoleGuard())
  async getCase(
    @JwtTokenDecoder() user: TokenUser,
    @Param('caseId') caseId: string
  ): Promise<CaseResponseDto> {
    return this.caseService.getCase(user.userId, caseId);
  }

}
