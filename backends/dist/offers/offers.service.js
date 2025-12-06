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
exports.OffersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const offer_schema_1 = require("./schemas/offer.schema");
let OffersService = class OffersService {
    offerModel;
    constructor(offerModel) {
        this.offerModel = offerModel;
    }
    async create(dto) {
        const payload = { ...dto, date: new Date(dto.date) };
        return this.offerModel.create(payload);
    }
    async findAll() {
        return this.offerModel.find().sort({ date: -1 }).exec();
    }
    async findOne(id) {
        this.ensureObjectId(id);
        const doc = await this.offerModel.findById(id).exec();
        if (!doc)
            throw new common_1.NotFoundException('Offre introuvable');
        return doc;
    }
    async update(id, dto) {
        this.ensureObjectId(id);
        const payload = { ...dto };
        if (dto.date)
            payload.date = new Date(dto.date);
        const doc = await this.offerModel.findByIdAndUpdate(id, payload, { new: true }).exec();
        if (!doc)
            throw new common_1.NotFoundException('Offre introuvable');
        return doc;
    }
    async remove(id) {
        this.ensureObjectId(id);
        const doc = await this.offerModel.findByIdAndDelete(id).exec();
        if (!doc)
            throw new common_1.NotFoundException('Offre introuvable');
        return { message: 'Offre supprimée' };
    }
    ensureObjectId(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.BadRequestException('Identifiant invalide');
    }
};
exports.OffersService = OffersService;
exports.OffersService = OffersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(offer_schema_1.Offer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OffersService);
//# sourceMappingURL=offers.service.js.map