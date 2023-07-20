import { BadRequestException } from '@nestjs/common';
import { Response } from '../enums/response';

export class DeleteErrorException extends BadRequestException {
  constructor() {
    super(Response.DELETE_ERROR);
  }
}
