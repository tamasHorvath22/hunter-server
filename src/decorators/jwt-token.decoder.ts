import { createParamDecorator } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { UserDocument } from '../schemas/user.schema';

export const JwtTokenDecoder = createParamDecorator((data, req): UserDocument => {
  const jwtService = new JwtService({ secret: process.env.ACCESS_JWT_PRIVATE_KEY });
  return jwtService.decode(req.args[1].req.headers.authorization.substring(7)) as UserDocument;
});
