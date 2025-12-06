import { AuthService } from '../auth/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenBlacklistService } from './token-blacklist.service';
export declare class AuthController {
    private readonly authService;
    private readonly blacklistService;
    constructor(authService: AuthService, blacklistService: TokenBlacklistService);
    register(dto: RegisterDto): Promise<any>;
    getProtected(req: any): {
        ok: boolean;
        user: any;
    };
    logout(req: any): {
        message: string;
    };
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
}
