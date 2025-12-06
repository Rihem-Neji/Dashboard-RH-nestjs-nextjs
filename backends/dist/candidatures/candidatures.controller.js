"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidaturesController = void 0;
const common_1 = require("@nestjs/common");
const candidatures_service_1 = require("./candidatures.service");
const create_candidature_dto_1 = require("./dto/create-candidature.dto");
const update_candidature_dto_1 = require("./dto/update-candidature.dto");
const query_candidature_dto_1 = require("./dto/query-candidature.dto");
const jwt_blacklist_guard_1 = require("../auth/guards/jwt-blacklist.guard");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const path_1 = require("path");
let CandidaturesController = class CandidaturesController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(dto, file) {
        if (!file) {
            throw new common_1.BadRequestException('Le CV (PDF) est requis (champ "cv").');
        }
        return this.service.createWithFile(dto, {
            cvUrl: `/uploads/cv/${file.filename}`,
            cvOriginalName: file.originalname,
            cvMimeType: file.mimetype,
            cvSize: file.size,
        });
    }
    findAll() {
        return this.service.findAll();
    }
    search(q) {
        return this.service.search(q);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.CandidaturesController = CandidaturesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('cv', {
        storage: (0, multer_1.diskStorage)({
            destination: (_req, _file, cb) => {
                const dest = path.join(process.cwd(), 'uploads', 'cv');
                if (!fs.existsSync(dest))
                    fs.mkdirSync(dest, { recursive: true });
                cb(null, dest);
            },
            filename: (_req, file, cb) => {
                const rnd = Math.random().toString(36).slice(2, 8);
                cb(null, `${Date.now()}-${rnd}${(0, path_1.extname)(file.originalname)}`);
            }
        }),
        fileFilter: (_req, file, cb) => {
            const ok = file.mimetype === 'application/pdf';
            cb(ok ? null : new Error('PDF uniquement'), ok);
        },
        limits: { fileSize: 8 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_candidature_dto_1.CreateCandidatureDto, Object]),
    __metadata("design:returntype", Promise)
], CandidaturesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_blacklist_guard_1.JwtBlacklistGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Toutes les candidatures' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CandidaturesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_blacklist_guard_1.JwtBlacklistGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['submitted', 'pending', 'accepted', 'rejected'] }),
    (0, swagger_1.ApiQuery)({ name: 'id_offre', required: false }),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_candidature_dto_1.QueryCandidatureDto]),
    __metadata("design:returntype", void 0)
], CandidaturesController.prototype, "search", null);
__decorate([
    (0, common_1.UseGuards)(jwt_blacklist_guard_1.JwtBlacklistGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CandidaturesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_blacklist_guard_1.JwtBlacklistGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_candidature_dto_1.UpdateCandidatureDto]),
    __metadata("design:returntype", void 0)
], CandidaturesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_blacklist_guard_1.JwtBlacklistGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CandidaturesController.prototype, "remove", null);
exports.CandidaturesController = CandidaturesController = __decorate([
    (0, swagger_1.ApiTags)('candidatures'),
    (0, common_1.Controller)('candidatures'),
    __metadata("design:paramtypes", [candidatures_service_1.CandidaturesService])
], CandidaturesController);
//# sourceMappingURL=candidatures.controller.js.map