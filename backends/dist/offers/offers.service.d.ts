import { Model } from 'mongoose';
import { Offer, OfferDocument } from './schemas/offer.schema';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
export declare class OffersService {
    private offerModel;
    constructor(offerModel: Model<OfferDocument>);
    create(dto: CreateOfferDto): Promise<Offer>;
    findAll(): Promise<Offer[]>;
    findOne(id: string): Promise<Offer>;
    update(id: string, dto: UpdateOfferDto): Promise<Offer>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private ensureObjectId;
}
