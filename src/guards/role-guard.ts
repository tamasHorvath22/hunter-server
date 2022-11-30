import { CanActivate, ExecutionContext, mixin } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../enums/role";
import { UserDocument } from "../schemas/user.schema";

export const RoleGuard = (role: Role = null): any => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers.authorization;
      if (!authorization) {
        return false;
      }
      const token = authorization.substring(7);
      const jwtService = new JwtService({ secret: process.env.ACCESS_JWT_PRIVATE_KEY });
      const decoded = jwtService.decode(token);
      if (!decoded) {
        return false;
      }
      return !role ? true : (decoded as UserDocument).role === role;
    }
  }

  return mixin(RoleGuardMixin);
}
