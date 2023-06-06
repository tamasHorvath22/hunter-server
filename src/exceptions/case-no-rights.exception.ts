import { BadRequestException } from '@nestjs/common';
import { Response } from '../enums/response';

export class CaseNoRightsException extends BadRequestException {
  constructor() {
    super(Response.CASE_NO_RIGHTS);
  }
}
