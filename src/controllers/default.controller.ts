import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class DefaultController {

  @Get('/')
  async getDefault(): Promise<string> {
    return 'This is the default message';
  }

}
