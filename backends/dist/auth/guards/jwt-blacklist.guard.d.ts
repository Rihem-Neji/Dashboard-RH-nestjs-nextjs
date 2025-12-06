import { ExecutionContext } from '@nestjs/common';
import { TokenBlacklistService } from '../token-blacklist.service';
declare const JwtBlacklistGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtBlacklistGuard extends JwtBlacklistGuard_base {
    private readonly blacklistService;
    constructor(blacklistService: TokenBlacklistService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
}
export {};
