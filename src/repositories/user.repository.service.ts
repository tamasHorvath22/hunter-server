import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Connection, FilterQuery, Model } from 'mongoose';
import { DocumentName } from '../enums/document-name';
import { Response } from '../enums/response';
import { LoggerService } from '../services/logger.service';
import { LoggerType } from '../enums/logger-type';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectModel(DocumentName.USER) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: Connection,
    private loggerService: LoggerService
  ) {}

  public async createUser(user: User): Promise<UserDocument> {
    try {
      const newUser = new this.userModel(user);
      await newUser.save();
      return newUser;
    } catch (error) {
      this.loggerService.error(LoggerType.USER_REPOSITORY_SERVICE, `User create error: ${user.email}, ${error}`);
      throw new HttpException(Response.USER_CREATE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async find(userFilterQuery: FilterQuery<User>): Promise<UserDocument> {
    try {
      return await this.userModel.findOne(userFilterQuery);
    } catch (error) {
      this.loggerService.error(LoggerType.USER_REPOSITORY_SERVICE, `Finding User error: ${userFilterQuery.email}, ${error}`);
      throw new HttpException(Response.FIND_USER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateUser(
    userFilterQuery: FilterQuery<User>,
    user: Partial<User>
  ): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(userFilterQuery, user);
  }

}
