import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserRepositoryService } from '../repositories/user.repository.service';
import { LoginDto } from '../dtos/login.dto';
import { Response } from '../enums/response';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
    private userRepository: UserRepositoryService,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const saved = this.userRepository.createUser(createUserDto.username);
    if (!saved) {
      throw new HttpException(Response.USER_CREATE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const user = await this.userRepository.findByUsername(loginDto.username);
    if (!user) {
      throw new HttpException(Response.NO_USER_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!user.password) {
      user.password = await bcrypt.hash(loginDto.password, 10);
      // await this.userRepository.updateUser(user);
      return { token: Response.NO_PASSWORD_SET };
    }
    if (!await bcrypt.compare(loginDto.password, user.password)) {
      throw new HttpException(Response.WRONG_NAME_OR_PASS, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { token: this.generateJwtToken(user) };
  }

  private generateJwtToken(user: UserDocument): string {
    return this.jwtService.sign(
      {
        userId: user._id.toString(),
        username: user.username
      }
    );
  }
}
