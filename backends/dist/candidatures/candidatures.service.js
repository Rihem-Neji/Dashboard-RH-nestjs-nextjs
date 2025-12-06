"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidaturesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const candidature_schema_1 = require("./schemas/candidature.schema");
let CandidaturesService = class CandidaturesService {
    candidatureModel;
    constructor(candidatureModel) {
        this.candidatureModel = candidatureModel;
    }
    async createWithFile(dto, cv) {
        const exists = await this.candidatureModel.exists({
            email: dto.email.toLowerCase(),
            id_offre: new mongoose_2.Types.ObjectId(dto.id_offre),
        });
        if (exists)
            throw new common_1.ConflictException('Vous avez déjà postulé à cette offre');
        return this.candidatureModel.create({
            id_offre: new mongoose_2.Types.ObjectId(dto.id_offre),
            nom: dto.nom.trim(),
            prenom: dto.prenom.trim(),
            email: dto.email.toLowerCase().trim(),
            status: dto.status ?? 'submitted',
            ...cv,
        });
    }
    async findAll() {
        return this.candidatureModel
            .find({})
            .populate('id_offre', ['id_offre', 'titre', 'status_offre'])
            .sort({ createdAt: -1 })
            .exec();
    }
    async search(q) {
        const query = {};
        if (q.status)
            query.status = q.status;
        if (q.id_offre) {
            if (!mongoose_2.Types.ObjectId.isValid(q.id_offre)) {
                throw new common_1.BadRequestException('id_offre invalide');
            }
            query.id_offre = new mongoose_2.Types.ObjectId(q.id_offre);
        }
        return this.candidatureModel
            .find(query)
            .populate('id_offre', ['id_offre', 'titre', 'status_offre'])
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('id invalide');
        const doc = await this.candidatureModel
            .findById(id)
            .populate('id_offre', ['id_offre', 'titre'])
            .exec();
        if (!doc)
            throw new common_1.NotFoundException('Candidature introuvable');
        return doc;
    }
    async update(id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('id invalide');
        const updated = await this.candidatureModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();
        if (!updated)
            throw new common_1.NotFoundException('Candidature introuvable');
        return updated;
    }
    async remove(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('id invalide');
        const deleted = await this.candidatureModel.findByIdAndDelete(id).exec();
        if (!deleted)
            throw new common_1.NotFoundException('Candidature introuvable');
        return { message: 'Candidature supprimée' };
    }
};
exports.CandidaturesService = CandidaturesService;
exports.CandidaturesService = CandidaturesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(candidature_schema_1.Candidature.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CandidaturesService);
//# sourceMappingURL=candidatures.service.js.map