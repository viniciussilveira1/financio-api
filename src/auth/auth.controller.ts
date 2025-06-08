import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from '../common/interfaces/Authentication';
import { Public } from './public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { LoginRequest } from './dto/login-request.dto';

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
      id: req.id,
      name: req.name,
    });
  }
}
