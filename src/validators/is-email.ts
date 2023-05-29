import { IsEmail } from 'class-validator';
import { Response } from '../enums/response';

export const IsValidEmail = () => IsEmail({}, { message: Response.MUST_BE_EMAIL });
