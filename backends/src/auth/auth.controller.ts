import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService} from '../auth/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtBlacklistGuard } from './guards/jwt-blacklist.guard';
import { TokenBlacklistService } from './token-blacklist.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService ,private readonly blacklistService: TokenBlacklistService,) {}

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto); // <-- renvoie un user sans password
  }
  // ---- PROTECTED ENDPOINT ----
  @ApiBearerAuth()                              // fait apparaître le cadenas + bouton Authorize dans Swagger
  @UseGuards(JwtAuthGuard, JwtBlacklistGuard)   // d’abord valider le JWT, puis vérifier s’il est blacklisté
  @Get('protected')
  @ApiOkResponse({ schema: { example: { ok: true, user: { sub: '...', email: '...' } } } })
  getProtected(@Req() req: any) {
    return { ok: true, user: req.user };
  }
  @UseGuards(JwtBlacklistGuard)
  @Post('logout')
  logout(@Req() req) {
    const token = req.headers['authorization']?.split(' ')[1];
    this.blacklistService.add(token);
    return { message: 'Déconnexion réussie, token invalidé.' };
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto); // <-- renvoie { access_token }
  }
}
