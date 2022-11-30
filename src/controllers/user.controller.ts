import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RoleGuard } from "../guards/role-guard";
import { Role } from "../enums/role";
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginDto } from '../dtos/login.dto';

@Controller('/api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create-user')
  // @UseGuards(RoleGuard(Role.ADMIN))
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.userService.createUser(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.userService.login(loginDto);
  }
}
