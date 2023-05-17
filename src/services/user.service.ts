import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserRepositoryService } from '../repositories/user.repository.service';
import { LoginDto } from '../dtos/login.dto';
import { Response } from '../enums/response';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

  constructor(
    private userRepository: UserRepositoryService,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    const newUser: User = {
      username: createUserDto.username,
      role: createUserDto.role,
      password: null,
      isActive: true,
      validUntil
    };
    await this.userRepository.createUser(newUser);
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const user = await this.userRepository.find({ username: loginDto.username });
    if (!user) {
      throw new HttpException(Response.WRONG_NAME_OR_PASS, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!user.password) {
      user.password = await bcrypt.hash(loginDto.password, 10);
      throw new HttpException(Response.NO_PASSWORD_SET, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!await bcrypt.compare(loginDto.password, user.password)) {
      throw new HttpException(Response.WRONG_NAME_OR_PASS, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { token: this.generateJwtToken(user as any) };
  }

  async setPassword(loginDto: LoginDto): Promise<{ token: string }> {
    const user = await this.userRepository.find({ username: loginDto.username });
    if (!user) {
      throw new HttpException(Response.NO_USER_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (user.password) {
      throw new HttpException(Response.PASSWORD_ALREADY_SET, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const hashedPassword = await bcrypt.hash(loginDto.password, 10);
    const updatedUser = await this.userRepository.updateUser(
      { _id: user._id },
      { password: hashedPassword }
    );
    if (!updatedUser) {
      throw new HttpException(Response.DATABASE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { token: this.generateJwtToken(user) };
  }

  private generateJwtToken(user: UserDocument): string {
    return this.jwtService.sign(
      {
        userId: user._id.toString(),
        username: user.username,
        role: user.role
      },
      {
        expiresIn: user.validUntil ? user.validUntil.getTime() : null
      }
    );
  }
}
