import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Post('/register')
  async register(
    @Body() body: { username: string; email: string; password: string },
  ) {
    // Mock implementation
    return {
      message: 'User created successfully',
      user: {
        id: 1,
        username: body.username,
        email: body.email,
      },
    };
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
