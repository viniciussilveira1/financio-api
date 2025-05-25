import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedUser, LoginRequest } from '../models/Authentication';
import { Public } from './public.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginRequest) {
    const user = await this.authService.validateUser(body);
    return this.authService.login(user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: AuthenticatedUser) {
    return this.authService.login({
      userId: req.userId,
      username: req.username,
    });
  }
}
