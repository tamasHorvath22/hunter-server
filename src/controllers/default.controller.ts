import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class DefaultController {

  @Get('/')
  async getDefault(): Promise<string> {
    console.log('????????????')
    return 'This is the default message';
  }

}
