import { BadRequestException } from '@nestjs/common';
import { Response } from '../enums/response';

export class InvalidDataException extends BadRequestException {
  constructor() {
    super(Response.INVALID_DATA);
  }
}
