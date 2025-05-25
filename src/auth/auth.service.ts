import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedUser, LoginRequest } from '../models/Authentication';
import { UsersService } from '../users/users.service';
import { comparePassword } from '../users/utils/hash-password.util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(body: LoginRequest): Promise<AuthenticatedUser> {
    const user = await this.usersService.findByEmail(body.email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const passwordMatches = await comparePassword(body.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    return user;
  }

  login(user: AuthenticatedUser): { access_token: string } {
    const payload = { name: user.name, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
