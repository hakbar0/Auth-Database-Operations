import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../dtos/register-user-dto';
import { BadRequestException } from '@nestjs/common';
import { User } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Registers a new user with the provided username, email, and password.
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
   * Logs in a user with the provided email and password.
   * Throws an UnauthorizedException if the email and password do not match a user in the database.
   * @param req The request object containing the user information.
   * @returns An object with a message and an access token.
   */
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Req() req): Promise<{ accessToken: string }> {
    const user: User = req.user;
    return await this.authService.login(user.username, user.uuid);
  }

  /**
   * A protected route that requires a JWT token to access.
   * @param req The request object containing the user information.
   * @returns An object containing the user profile information, excluding the password and id.
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async protectedRoute(@Req() req): Promise<Partial<User>> {
    const user = await this.authService.findByUsername(req.user.username);
    const { password: _password, id: _id, ...profile } = user;
    return profile;
  }
}
