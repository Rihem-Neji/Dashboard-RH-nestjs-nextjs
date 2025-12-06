import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Offer, OfferDocument } from './schemas/offer.schema';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(@InjectModel(Offer.name) private offerModel: Model<OfferDocument>) {}

  async create(dto: CreateOfferDto): Promise<Offer> {
    // convertir la date (string ISO) -> Date
    const payload = { ...dto, date: new Date(dto.date) };
    return this.offerModel.create(payload);
  }

  async findAll(): Promise<Offer[]> {
    return this.offerModel.find().sort({ date: -1 }).exec();
  }

  async findOne(id: string): Promise<Offer> {
    this.ensureObjectId(id);
    const doc = await this.offerModel.findById(id).exec();
    if (!doc) throw new NotFoundException('Offre introuvable');
    return doc;
  }

  async update(id: string, dto: UpdateOfferDto): Promise<Offer> {
    this.ensureObjectId(id);
    const payload: any = { ...dto };
    if (dto.date) payload.date = new Date(dto.date);

    const doc = await this.offerModel.findByIdAndUpdate(id, payload, { new: true }).exec();
    if (!doc) throw new NotFoundException('Offre introuvable');
    return doc;
  }

  async remove(id: string): Promise<{ message: string }> {
    this.ensureObjectId(id);
    const doc = await this.offerModel.findByIdAndDelete(id).exec();
    if (!doc) throw new NotFoundException('Offre introuvable');
    return { message: 'Offre supprimée' };
  }

  private ensureObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Identifiant invalide');
  }
}
