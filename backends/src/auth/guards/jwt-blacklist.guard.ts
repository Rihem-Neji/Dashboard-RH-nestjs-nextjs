// src/auth/guards/jwt-blacklist.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenBlacklistService } from '../token-blacklist.service';

@Injectable()
export class JwtBlacklistGuard extends AuthGuard('jwt') {
  constructor(private readonly blacklistService: TokenBlacklistService) {
    super(); // important
  }

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'] as string | undefined;
    const token = authHeader?.split(' ')[1];

    // si le token est sur liste noire → 401
    if (token && this.blacklistService.has(token)) {
      throw new UnauthorizedException('Token invalidé (blacklist)');
    }
    return super.canActivate(context);
  }
}
