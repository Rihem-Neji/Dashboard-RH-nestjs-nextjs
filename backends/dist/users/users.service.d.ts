import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
type PreprocessFn = (data: Partial<User>) => Promise<Partial<User>> | Partial<User>;
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findByEmail(email: string): Promise<UserDocument | null>;
    findByEmailWithPassword(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<import("mongoose").FlattenMaps<UserDocument> & Required<{
        _id: import("mongoose").FlattenMaps<unknown>;
    }> & {
        __v: number;
    }>;
    create(data: Partial<User>, options?: {
        preprocess?: PreprocessFn;
    }): Promise<UserDocument>;
}
export {};
