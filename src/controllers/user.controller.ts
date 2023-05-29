import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RoleGuard } from "../guards/role-guard";
import { Role } from "../enums/role";
import { CreateSubscriberDto } from '../dtos/create-subscriber.dto';

@Controller('/api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create-subscriber')
  // @UseGuards(RoleGuard(Role.ADMIN))
  async createSubscriber(@Body() createUserDto: CreateSubscriberDto): Promise<void> {
    return this.userService.createSubscriber(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginDto: { email: string }): Promise<{ token: string }> {
    return this.userService.login(loginDto.email);
  }

}
