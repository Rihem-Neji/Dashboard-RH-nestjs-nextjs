"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCandidatureDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_candidature_dto_1 = require("./create-candidature.dto");
class UpdateCandidatureDto extends (0, mapped_types_1.PartialType)(create_candidature_dto_1.CreateCandidatureDto) {
}
exports.UpdateCandidatureDto = UpdateCandidatureDto;
//# sourceMappingURL=update-candidature.dto.js.map