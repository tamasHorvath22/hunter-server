import { BadRequestException } from '@nestjs/common';
import { Response } from '../enums/response';

export class UsernameTakenException extends BadRequestException {
  constructor() {
    super(Response.USERNAME_TAKEN);
  }
}
