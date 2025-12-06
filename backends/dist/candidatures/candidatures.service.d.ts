import { Model } from 'mongoose';
import { Candidature, CandidatureDocument } from './schemas/candidature.schema';
import { CreateCandidatureDto } from './dto/create-candidature.dto';
import { UpdateCandidatureDto } from './dto/update-candidature.dto';
import { QueryCandidatureDto } from './dto/query-candidature.dto';
type CvMeta = {
    cvUrl: string;
    cvOriginalName: string;
    cvMimeType: string;
    cvSize: number;
};
export declare class CandidaturesService {
    private candidatureModel;
    constructor(candidatureModel: Model<CandidatureDocument>);
    createWithFile(dto: CreateCandidatureDto, cv: CvMeta): Promise<import("mongoose").Document<unknown, {}, CandidatureDocument, {}, {}> & Candidature & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, CandidatureDocument, {}, {}> & Candidature & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    search(q: QueryCandidatureDto): Promise<(import("mongoose").Document<unknown, {}, CandidatureDocument, {}, {}> & Candidature & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, CandidatureDocument, {}, {}> & Candidature & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: string, dto: UpdateCandidatureDto): Promise<import("mongoose").Document<unknown, {}, CandidatureDocument, {}, {}> & Candidature & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
export {};
