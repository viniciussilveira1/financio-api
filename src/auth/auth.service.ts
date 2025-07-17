import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  AuthenticatedUser,
  LoginRequest,
} from '../common/interfaces/Authentication';
import { UsersService } from '../users/users.service';
import { comparePassword } from '../common/utils/hash-password.util';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(body: LoginRequest): Promise<AuthenticatedUser> {
    const user = await this.usersService.findByEmail(body.email);
    const errorMessage = 'Usuário ou senha inválidos';

    if (!user || !user.password) {
      throw new UnauthorizedException(errorMessage);
    }

    const passwordMatches = await comparePassword(body.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException(errorMessage);
    }

    return user;
  }

  login(user: AuthenticatedUser): { access_token: string } {
    const payload = { name: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private setLoginCookie(
    res: Response,
    access_token: string,
    rememberMe = true,
  ): void {
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined,
    });
  }

  handleLogin(
    user: AuthenticatedUser,
    res: Response,
    rememberMe: boolean,
  ): { access_token: string } {
    const { access_token } = this.login(user);
    this.setLoginCookie(res, access_token, rememberMe);
    return { access_token };
  }

  handleOAuthLogin(user: AuthenticatedUser, res: Response): void {
    const { access_token } = this.login(user);
    this.setLoginCookie(res, access_token, true);
    res.redirect(`http://localhost:5173/`);
  }
}
