import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from '../common/interfaces/Authentication';
import { Public } from './public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { LoginRequest } from './dto/login-request.dto';
import { Response } from 'express';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(body);
    return this.authService.handleLogin(user, res, body.rememberMe);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: AuthenticatedUser, @Res() res: Response) {
    this.authService.handleOAuthLogin(req, res);
  }
}
