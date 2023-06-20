import { BadRequestException } from '@nestjs/common';
import { Response } from '../enums/response';

export class InvalidQuotaSumException extends BadRequestException {
  constructor() {
    super(Response.INVALID_QUOTA_SUM);
  }
}
