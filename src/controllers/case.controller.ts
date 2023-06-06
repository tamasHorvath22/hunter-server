import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RoleGuard } from "../guards/role-guard";
import { JwtTokenDecoder } from '../decorators/jwt-token.decoder';
import { CreateCaseDto } from '../dtos/create-case.dto';
import { CaseService } from '../services/case.service';
import { UpdateCaseDto } from '../dtos/update-case.dto';
import { CaseMetaDto } from '../dtos/case-meta.dto';
import { TokenUser } from '../types/token-user';
import { CaseDto } from '../dtos/case.dto';

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
  ): Promise<void> {
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
  ): Promise<CaseDto> {
    return this.caseService.getCase(user.userId, caseId);
  }

}
