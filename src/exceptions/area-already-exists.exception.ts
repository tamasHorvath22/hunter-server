import { BadRequestException } from '@nestjs/common';
import { Response } from '../enums/response';

export class AreaAlreadyExistsException extends BadRequestException {
  constructor() {
    super(Response.AREA_ALREADY_EXISTS);
  }
}
