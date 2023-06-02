import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailAuthDto } from '../dtos/email-auth.dto';
import { Response } from '../enums/response';
import { Role } from '../enums/role';
import { UserRepositoryService } from '../repositories/user.repository.service';
import { SubscribedRepositoryService } from '../repositories/subscribed.repository.service';
import { User, UserDocument } from '../schemas/user.schema';
import { Subscribed } from '../schemas/subscribed.schema';

@Injectable()
export class UserService {

  constructor(
    private userRepository: UserRepositoryService,
    private subscribedRepositoryService: SubscribedRepositoryService,
    private jwtService: JwtService
  ) {}

  async login(email: string): Promise<{ token: string }> {
    const subscribed = await this.subscribedRepositoryService.find({ email });
    if (!subscribed) {
      throw new HttpException(Response.USER_NOT_SUBSCRIBED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    let user = await this.userRepository.find({ email });
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
    }
    return { token: this.generateJwtToken(user) };
  }

  async createSubscriber(createUserDto: EmailAuthDto): Promise<void> {
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
}
