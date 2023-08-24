import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from '../enums/response';
import { Role } from '../enums/role';
import { UserRepositoryService } from '../repositories/user.repository.service';
import { SubscribedRepositoryService } from '../repositories/subscribed.repository.service';
import { User, UserDocument } from '../schemas/user.schema';
import { Subscribed } from '../schemas/subscribed.schema';
import * as CryptoJS from 'crypto-js';
import { NewSubscriberDto } from '../dtos/new-subscriber.dto';
import { LoggerService } from './logger.service';
import { LoggerType } from '../enums/logger-type';

@Injectable()
export class UserService {

  constructor(
    private userRepository: UserRepositoryService,
    private subscribedRepositoryService: SubscribedRepositoryService,
    private jwtService: JwtService,
    private loggerService: LoggerService
  ) {}

  async login(emailHash: string): Promise<{ token: string }> {
    const email = this.decrypt(emailHash);
    if (!email) {
      this.loggerService.error(LoggerType.USER_SERVICE, 'Email description error.');
      throw new HttpException(Response.DATABASE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const subscribed = await this.subscribedRepositoryService.find({ email });
    if (!subscribed) {
      this.loggerService.warn(LoggerType.USER_SERVICE, `Not existing subscriber login request. Email: ${email}`);
      throw new HttpException(Response.USER_NOT_SUBSCRIBED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    let user = await this.userRepository.find({ email: email });
    if (!user) {
      // TODO implement validUntil logic
      const validUntil = subscribed.createdAt;
      validUntil.setFullYear(validUntil.getFullYear() + 1);
      const newUser: User = {
        email: email,
        role: Role.USER,
        isActive: true,
        validUntil
      };
      user = await this.userRepository.createUser(newUser);
      this.loggerService.info(LoggerType.USER_SERVICE, `Successful user creation. Email: ${email}`);
    }
    this.loggerService.info(LoggerType.USER_SERVICE, `Successful login. Email: ${email}`);
    return { token: this.generateJwtToken(user) };
  }

  async createSubscriber(createUserDto: NewSubscriberDto): Promise<void> {
    const subscriber: Subscribed = { email: createUserDto.email };
    await this.subscribedRepositoryService.createSubscriber(subscriber);
  }

  private generateJwtToken(user: UserDocument): string {
    return this.jwtService.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      },
      {
        expiresIn: user.validUntil ? user.validUntil.getTime() : null
      }
    );
  }

  private decrypt(text: string): string {
    const bytes = CryptoJS.AES.decrypt(text, process.env.REQUEST_SECRET);
    return bytes.toString() ? bytes.toString(CryptoJS.enc.Utf8) : null;
  }
}
