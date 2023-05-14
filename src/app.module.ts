import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { UserController } from './controllers/user.controller';
import { DefaultController } from './controllers/default.controller';
import { UserRepositoryService } from './repositories/user.repository.service';
import { UserService } from './services/user.service';
import { DocumentName } from "./enums/document-name";
import { UserSchema } from "./schemas/user.schema";
import { CaseSchema } from './schemas/case.schema';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}${process.env.DB_NAME}?retryWrites=true&w=majority`),
    MongooseModule.forFeature([
      { name: DocumentName.USER, schema: UserSchema },
      { name: DocumentName.CASE, schema: CaseSchema }
    ]),
    JwtModule.register({ secret: process.env.ACCESS_JWT_PRIVATE_KEY })
  ],
  controllers: [UserController, DefaultController],
  providers: [UserService, UserRepositoryService]
})
export class AppModule {}
