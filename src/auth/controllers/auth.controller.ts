import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../dtos/register-user-dto';
import { BadRequestException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Creates a new user with the provided username, email, and password.
   * Throws a BadRequestException if a user with the same username or email already exists.
   * @param body The request body containing the username, email, and password.
   * @returns A Promise that resolves to the newly created User entity.
   */
  @Post('/register')
  async register(@Body() body: RegisterUserDto): Promise<Partial<User>> {
    try {
      const user = await this.authService.createUser(
        body.username,
        body.email,
        body.password,
      );
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Authenticates a user with the provided email and password.
   * Throws an UnauthorizedException if the email and password do not match a user in the database.
   * @param body The request body containing the email and password.
   * @returns An object with a message and an access token.
   */
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Req() req) {
    const user: User = req.user;
    return this.authService.login(user.username, user.uuid);
  }
}
