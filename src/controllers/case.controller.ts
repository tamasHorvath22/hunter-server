import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RoleGuard } from "../guards/role-guard";
import { JwtTokenDecoder } from '../decorators/jwt-token.decoder';
import { CaseService } from '../services/case.service';
import { CaseMetaDto } from '../dtos/case-meta.dto';
import { TokenUser } from '../types/token-user';
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

  @Post('/case/area')
  @UseGuards(RoleGuard())
  async createArea(
    @Body() createAreaDto: CreateAreaDto,
    @JwtTokenDecoder() user: TokenUser
  ): Promise<NewAreaDto> {
    return this.caseService.createArea(createAreaDto, user.userId);
  }

  @Put('/case/area')
  @UseGuards(RoleGuard())
  async updateArea(
    @Body() createAreaDto: CreateAreaDto,
    @JwtTokenDecoder() user: TokenUser
  ): Promise<NewAreaDto> {
    return this.caseService.updateArea(createAreaDto, user.userId);
  }

  @Put('/case')
  @UseGuards(RoleGuard())
  async updateCase(
    @Body() updateCaseDto: UpdateCaseDto,
    @JwtTokenDecoder() user: TokenUser
  ): Promise<UpdatedCaseDto> {
    return this.caseService.updateCase(updateCaseDto, user.userId);
  }

  @Put('/case/voter')
  @UseGuards(RoleGuard())
  async updateVoter(
    @Body() updateVoterDto: UpdateVoterDto,
    @JwtTokenDecoder() user: TokenUser
  ): Promise<UpdatedCaseDto> {
    return this.caseService.updateVoter(updateVoterDto, user.userId);
  }

  @Delete('/case/voter')
  @UseGuards(RoleGuard())
  async deleteVoter(
    @Body() deleteVoterDto: DeleteVoterDto,
    @JwtTokenDecoder() user: TokenUser
  ): Promise<UpdatedCaseDto> {
    return this.caseService.deleteVoter(deleteVoterDto, user.userId);
  }

  @Delete('/case')
  @UseGuards(RoleGuard())
  async deleteCase(
    @Body() deleteCaseDto: { caseId: string },
    @JwtTokenDecoder() user: TokenUser
  ): Promise<CaseMetaDto[]> {
    return this.caseService.deleteCase(deleteCaseDto, user.userId);
  }

  @Put('/case/modify-area')
  @UseGuards(RoleGuard())
  async modifyArea(
    @Body() updateCaseDto: ModifyAreaDto,
    @JwtTokenDecoder() user: TokenUser
  ): Promise<ModifiedAreaDto> {
    return this.caseService.modifyArea(updateCaseDto, user.userId);
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

  @Post('/case/motion')
  @UseGuards(RoleGuard())
  async createMotion(
    @Body() createMotionDto: CreateMotionDto,
    @JwtTokenDecoder() user: TokenUser
  ): Promise<UpdatedCaseDto> {
    return this.caseService.createMotion(createMotionDto, user.userId);
  }

}
