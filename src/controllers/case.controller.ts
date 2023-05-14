import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RoleGuard } from "../guards/role-guard";
import { JwtTokenDecoder } from '../decorators/jwt-token.decoder';
import { UserDocument } from '../schemas/user.schema';
import { CreateCaseDto } from '../dtos/create-case.dto';
import { CaseService } from '../services/case.service';

@Controller('/api')
export class UserController {
  constructor(private readonly caseService: CaseService) {}

  @Post('/case')
  @UseGuards(RoleGuard)
  async createCase(
    @Body() createCaseDto: CreateCaseDto,
    @JwtTokenDecoder() user: UserDocument
  ): Promise<void> {
    return this.caseService.createCase(createCaseDto, user.id);
  }

}
