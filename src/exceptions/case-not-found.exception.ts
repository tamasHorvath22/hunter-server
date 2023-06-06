import { BadRequestException } from '@nestjs/common';
import { Response } from '../enums/response';

export class CaseNotFoundException extends BadRequestException {
  constructor() {
    super(Response.CASE_NOT_FOUND);
  }
}
