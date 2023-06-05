import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { RoleGuard } from "../guards/role-guard";
import { JwtTokenDecoder } from '../decorators/jwt-token.decoder';
import { UserDocument } from '../schemas/user.schema';
import { CreateCaseDto } from '../dtos/create-case.dto';
import { CaseService } from '../services/case.service';
import { UpdateCaseDto } from '../dtos/update-case.dto';
import { CaseMetaDto } from '../dtos/case-meta.dto';

@Controller('/api')
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Post('/case')
  @UseGuards(RoleGuard())
  async createCase(
    @Body() createCaseDto: CreateCaseDto,
    @JwtTokenDecoder() user: UserDocument
  ): Promise<CaseMetaDto[]> {
    return this.caseService.createCase(createCaseDto, user.id);
  }

  @Put('/case')
  @UseGuards(RoleGuard())
  async updateCase(
    @Body() updateCaseDto: UpdateCaseDto,
    @JwtTokenDecoder() user: UserDocument
  ): Promise<void> {
    return this.caseService.updateCase(updateCaseDto, user.id);
  }

  @Get('/cases')
  @UseGuards(RoleGuard())
  async getCases(@JwtTokenDecoder() user: UserDocument): Promise<CaseMetaDto[]> {
    return this.caseService.getCases(user.id);
  }

}
