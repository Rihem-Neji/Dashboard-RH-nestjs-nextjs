import { Document, Types } from 'mongoose';
export type CandidatureDocument = Candidature & Document;
export declare class Candidature {
    nom: string;
    prenom: string;
    email: string;
    cvUrl?: string;
    cvOriginalName?: string;
    cvMimeType?: string;
    cvSize?: number;
    status: 'submitted' | 'pending' | 'accepted' | 'rejected';
    id_offre: Types.ObjectId;
}
export declare const CandidatureSchema: import("mongoose").Schema<Candidature, import("mongoose").Model<Candidature, any, any, any, Document<unknown, any, Candidature, any, {}> & Candidature & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Candidature, Document<unknown, {}, import("mongoose").FlatRecord<Candidature>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Candidature> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
