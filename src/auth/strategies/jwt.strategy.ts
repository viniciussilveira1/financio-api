import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '../../common/interfaces/Authentication';

interface RequestWithCookies extends Request {
  cookies: Record<string, string>;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the .env file');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => this.cookieExtractor(req),
      ]),
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: AuthenticatedUser) {
    return payload;
  }

  cookieExtractor = (req: RequestWithCookies): string | null => {
    if (req && req.cookies && typeof req.cookies['access_token'] === 'string') {
      return req.cookies['access_token'];
    }
    return null;
  };
}
