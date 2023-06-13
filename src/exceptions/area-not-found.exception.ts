import { BadRequestException } from '@nestjs/common';
import { Response } from '../enums/response';

export class AreaNotFoundException extends BadRequestException {
  constructor() {
    super(Response.AREA_NOT_FOUND);
  }
}
