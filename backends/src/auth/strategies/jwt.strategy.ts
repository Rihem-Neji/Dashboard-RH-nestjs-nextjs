import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    // --- AJOUTEZ CETTE LIGNE POUR DÉBOGUER ---
    console.log('JWT Secret récupéré par ConfigService:', secret);

    if (!secret) {
      throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    // ... votre logique de validation
    return { userId: payload.sub, firstname: payload.firstname, lastname: payload.lastname };
  }
}