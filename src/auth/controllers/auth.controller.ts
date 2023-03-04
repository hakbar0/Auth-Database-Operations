import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(
    @Body() body: { username: string; email: string; password: string },
  ) {
    return await this.authService.createPassword(body.password);
  }

  @Post('/login')
  async login(@Body() body: { email: string; password: string }) {
    // Mock implementation
    return {
      message: 'Logged in successfully',
      access_token: 'mock-access-token',
    };
  }

  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: any) {
    // Mock implementation
    return req.user;
  }
}
