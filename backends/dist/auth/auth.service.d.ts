import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    blacklistedTokens: Set<string>;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<import("../users/schemas/user.schema").UserDocument | null>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    private toSafeUser;
    register(dto: RegisterDto): Promise<any>;
}
