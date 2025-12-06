import { CandidaturesService } from './candidatures.service';
import { CreateCandidatureDto } from './dto/create-candidature.dto';
import { UpdateCandidatureDto } from './dto/update-candidature.dto';
import { QueryCandidatureDto } from './dto/query-candidature.dto';
export declare class CandidaturesController {
    private readonly service;
    constructor(service: CandidaturesService);
    create(dto: CreateCandidatureDto, file: Express.Multer.File): Promise<import("mongoose").Document<unknown, {}, import("./schemas/candidature.schema").CandidatureDocument, {}, {}> & import("./schemas/candidature.schema").Candidature & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/candidature.schema").CandidatureDocument, {}, {}> & import("./schemas/candidature.schema").Candidature & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    search(q: QueryCandidatureDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/candidature.schema").CandidatureDocument, {}, {}> & import("./schemas/candidature.schema").Candidature & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/candidature.schema").CandidatureDocument, {}, {}> & import("./schemas/candidature.schema").Candidature & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: string, dto: UpdateCandidatureDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/candidature.schema").CandidatureDocument, {}, {}> & import("./schemas/candidature.schema").Candidature & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
