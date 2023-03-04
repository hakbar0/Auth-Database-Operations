import { IsEmail, IsString, MaxLength, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MaxLength(50)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*) and be atleast 8 characters in length',
  })
  password: string;
}
