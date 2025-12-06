"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidaturesModule = void 0;
const common_1 = require("@nestjs/common");
const candidatures_service_1 = require("./candidatures.service");
const candidatures_controller_1 = require("./candidatures.controller");
const mongoose_1 = require("@nestjs/mongoose");
const candidature_schema_1 = require("./schemas/candidature.schema");
const auth_module_1 = require("../auth/auth.module");
let CandidaturesModule = class CandidaturesModule {
};
exports.CandidaturesModule = CandidaturesModule;
exports.CandidaturesModule = CandidaturesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: candidature_schema_1.Candidature.name, schema: candidature_schema_1.CandidatureSchema },
            ]),
            auth_module_1.AuthModule,
        ],
        providers: [candidatures_service_1.CandidaturesService],
        controllers: [candidatures_controller_1.CandidaturesController],
        exports: [candidatures_service_1.CandidaturesService]
    })
], CandidaturesModule);
//# sourceMappingURL=candidatures.module.js.map