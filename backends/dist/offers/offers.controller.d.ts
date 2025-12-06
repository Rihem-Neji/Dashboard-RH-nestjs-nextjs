import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
export declare class OffersController {
    private readonly offersService;
    constructor(offersService: OffersService);
    findAll(): Promise<import("./schemas/offer.schema").Offer[]>;
    findOne(id: string): Promise<import("./schemas/offer.schema").Offer>;
    create(dto: CreateOfferDto): Promise<import("./schemas/offer.schema").Offer>;
    update(id: string, dto: UpdateOfferDto): Promise<import("./schemas/offer.schema").Offer>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
