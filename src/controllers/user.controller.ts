import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RoleGuard } from "../guards/role-guard";
import { Role } from "../enums/role";
import { EmailAuthDto } from '../dtos/email-auth.dto';

@Controller('/api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create-subscriber')
  @UseGuards(RoleGuard(Role.ADMIN))
  async createSubscriber(@Body() createUserDto: EmailAuthDto): Promise<void> {
    return this.userService.createSubscriber(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginDto: EmailAuthDto): Promise<{ token: string }> {
    return this.userService.login(loginDto.email);
  }

}
