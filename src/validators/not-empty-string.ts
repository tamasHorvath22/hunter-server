import { IsNotEmpty } from 'class-validator';
import { Response } from '../enums/response';

export const IsNotEmptyString: Function = () => IsNotEmpty({ message: Response.MUST_NOT_BE_EMPTY });
