import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        const tokenFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        const tokenFromCookie = req.cookies?.access_token;
        return tokenFromHeader || tokenFromCookie;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string, // Явное приведение типа
    } as const); // as const для точного соответствия типов
  }

  async validate(payload: any) {
    return { 
      sub: payload.sub, 
      username: payload.login, 
      roles: payload.roles 
    };
  }
}