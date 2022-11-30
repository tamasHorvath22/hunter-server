import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from "@nestjs/config";
import { UserSchema } from "./schemas/user.schema";
import { DocumentName } from "./enums/document-name";
import { JwtModule } from "@nestjs/jwt";
import { UserRepositoryService } from './repositories/user.repository.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}${process.env.DB_NAME}?retryWrites=true&w=majority`),
    MongooseModule.forFeature([
      { name: DocumentName.USER, schema: UserSchema }
    ]),
    JwtModule.register({ secret: process.env.ACCESS_JWT_PRIVATE_KEY })
  ],
  controllers: [UserController],
  providers: [UserService, UserRepositoryService]
})
export class AppModule {}
