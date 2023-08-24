import { BadRequestException } from '@nestjs/common';
import { Response } from '../enums/response';

export class CaseUpdateErrorException extends BadRequestException {
  constructor() {
    super(Response.CASE_UPDATE_ERROR);
  }
}
