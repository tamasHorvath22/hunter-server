import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { DocumentName } from '../enums/document-name';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserRepositoryService {
  constructor(@InjectModel(DocumentName.USER) private userModel: Model<UserDocument>) {}

  public async createUser(createUserDto: CreateUserDto): Promise<boolean> {
    const session = await this.userModel.db.startSession();
    session.startTransaction();

    try {
      const newUser = new this.userModel({
        username: createUserDto.username,
        role: createUserDto.role,
        password: null
      });
      await newUser.save();
      await session.commitTransaction();
      await session.endSession();
      return true;
    } catch (e) {
      await session.abortTransaction();
      await session.endSession();
      if (e.keyPattern.username) {
        return null;
      }
      return false;
    }
  }

  public async findById(id: string): Promise<UserDocument> {
    try {
      return await this.userModel.findById(id);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async findByUsername(username: string): Promise<UserDocument> {
    try {
      return await this.userModel.findOne({ username: username });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  public async updateUser(user: UserDocument): Promise<boolean> {
    try {
      await this.userModel.findByIdAndUpdate(user._id, user);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

}
