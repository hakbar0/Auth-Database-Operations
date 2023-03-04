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
  @Post('/login')
  async login(@Body() body: { email: string; password: string }) {
    // TODO: Implement authentication logic using Passport
    // Mock implementation
    return {
      message: 'Logged in successfully',
      access_token: 'mock-access-token',
    };
  }

  /**
   * Gets the profile of the currently authenticated user.
   * Throws an UnauthorizedException if the user is not authenticated.
   * @param req The request object, which contains the authenticated user in the user property.
   * @returns A Promise that resolves to the User entity of the authenticated user.
   */
  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: any) {
    // req.user contains the authenticated user
    return req.user;
  }
}
