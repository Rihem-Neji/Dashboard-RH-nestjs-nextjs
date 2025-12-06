import { Injectable , UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService} from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
   public blacklistedTokens = new Set<string>(); // La liste des tokens
    constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;
    return user; // contient password ici, mais on ne le renvoie pas au client
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Email ou mot de passe invalide');

    const payload = { sub: user._id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  private toSafeUser(userDoc: any) {
    // grâce au toJSON du schéma, password n’est déjà plus là,
    // mais on sécurise au cas où
    const obj = typeof userDoc.toObject === 'function' ? userDoc.toObject() : userDoc;
    delete obj.password;
    return obj;
  }

  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.usersService.create({
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email,
      password: hashed,
      role: 'user',
    });
    return this.toSafeUser(created); // <-- renvoie l’utilisateur sans password
  }
}
