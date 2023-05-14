import { UserDocument } from '../schemas/user.schema';
import { UserType } from '../types/user-type';

export namespace UserMapper {
  export const toUserDto = (user: UserDocument): UserType => {
    return {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    }
  }
}
