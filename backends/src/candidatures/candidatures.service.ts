import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

@Injectable()
export class CandidaturesService {
  constructor(
    @InjectModel(Candidature.name)
    private candidatureModel: Model<CandidatureDocument>,
  ) {}

//  async create(dto: CreateCandidatureDto): Promise<Candidature> {
    ///// Empêcher doublon (index unique gère aussi, mais on pré-vérifie pour renvoyer un message propre)
    //const exists = await this.candidatureModel.exists({
      //email: dto.email.toLowerCase(),
      /////id_offre: new Types.ObjectId(dto.id_offre),
    //});
    //if (exists) throw new ConflictException('Déjà candidat(e) à cette offre');

    //return this.candidatureModel.create({
      //...dto,
     // email: dto.email.toLowerCase(),
      //id_offre: new Types.ObjectId(dto.id_offre),
      //status: dto.status ?? 'submitted',
   // });
  //}

  async createWithFile(dto: CreateCandidatureDto, cv: CvMeta) {
    // Unicité: déjà candidat pour la même offre ?
    const exists = await this.candidatureModel.exists({
      email: dto.email.toLowerCase(),
      id_offre: new Types.ObjectId(dto.id_offre),
    });
    if (exists) throw new ConflictException('Vous avez déjà postulé à cette offre');

    return this.candidatureModel.create({
      id_offre: new Types.ObjectId(dto.id_offre),
      nom: dto.nom.trim(),
      prenom: dto.prenom.trim(),
      email: dto.email.toLowerCase().trim(),
      status: dto.status ?? 'submitted',
      ...cv,
    });
  }

  async findAll() {
    return this.candidatureModel
      .find({})
      .populate('id_offre', ['id_offre', 'titre', 'status_offre'])
      .sort({ createdAt: -1 })
      .exec();
  }

  async search(q: QueryCandidatureDto) {
    const query: any = {};
    if (q.status) query.status = q.status;

    if (q.id_offre) {
      if (!Types.ObjectId.isValid(q.id_offre)) {
        throw new BadRequestException('id_offre invalide');
      }
      query.id_offre = new Types.ObjectId(q.id_offre);
    }

    return this.candidatureModel
      .find(query)
      .populate('id_offre', ['id_offre', 'titre', 'status_offre'])
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('id invalide');
    const doc = await this.candidatureModel
      .findById(id)
      .populate('id_offre', ['id_offre', 'titre'])
      .exec();
    if (!doc) throw new NotFoundException('Candidature introuvable');
    return doc;
  }

  async update(id: string, dto: UpdateCandidatureDto) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('id invalide');
    const updated = await this.candidatureModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Candidature introuvable');
    return updated;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('id invalide');
    const deleted = await this.candidatureModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Candidature introuvable');
    return { message: 'Candidature supprimée' };
  }
}
