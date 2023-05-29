import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { FilterQuery, Model, Connection } from 'mongoose';
import { DocumentName } from '../enums/document-name';
import { UsernameTakenException } from '../exceptions/username-taken.exception';
import { Response } from '../enums/response';

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectModel(DocumentName.USER) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: Connection
  ) {}

  public async createUser(user: User): Promise<UserDocument> {
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();

    try {
      const newUser = new this.userModel(user);
      await newUser.save();
      await transactionSession.commitTransaction();
      await transactionSession.endSession();
      return newUser;
    } catch (error) {
      await transactionSession.abortTransaction();
      await transactionSession.endSession();
      if (error.keyPattern.username) {
        throw new UsernameTakenException();
      }
      throw new HttpException(Response.USER_CREATE_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async find(userFilterQuery: FilterQuery<User>): Promise<UserDocument> {
    return this.userModel.findOne(userFilterQuery);
  }

  public async updateUser(
    userFilterQuery: FilterQuery<User>,
    user: Partial<User>
  ): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(userFilterQuery, user);
  }

}
