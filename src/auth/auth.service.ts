import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  AuthenticatedUser,
  LoginRequest,
} from '../common/interfaces/Authentication';
import { UsersService } from '../users/users.service';
import { comparePassword } from '../common/utils/hash-password.util';

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
}
