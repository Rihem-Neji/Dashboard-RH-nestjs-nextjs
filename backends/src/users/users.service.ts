import { Injectable , ConflictException , NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User , UserDocument} from './schemas/user.schema';

type PreprocessFn = (data: Partial<User>) => Promise<Partial<User>> | Partial<User>;

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    // password non sélectionné car select:false dans le schéma
    return this.userModel.findOne({ email }).exec();
  }
  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    // quand on a besoin de comparer le mot de passe (login)
    return this.userModel.findOne({ email }).select('+password').exec();
  }
  async findById(id: string) {
    const u = await this.userModel.findById(id).lean();
    if (!u) throw new NotFoundException('Utilisateur introuvable');
    return u;
  }


 // ✅ Version combinée : pré-traitement + vérif. d’unicité + new+save + réponse safe
  async create(
    data: Partial<User>,
    options?: { preprocess?: PreprocessFn }
  ): Promise<UserDocument> {
    // 1) Pré-traitement (ex: trim/lowercase/hashing…) si fourni
    const payload = options?.preprocess ? await options.preprocess({ ...data }) : { ...data };

    // 2) Vérifier l’unicité de l’email (rapide, sans charger tout le doc)
    if (payload.email) {
      const exists = await this.userModel.exists({ email: payload.email });
      if (exists) throw new ConflictException('Email already registered');
    }

    // 3) Créer une instance (flexible : tu pourrais encore modifier avant save)
    const doc = new this.userModel(payload);

    // 4) Sauvegarder
    await doc.save();

    // 5) Nettoyer la réponse (ne jamais renvoyer le password)
    //    (ton schema toJSON supprime déjà password, mais on sécurise)
    const obj = doc.toObject();
    delete (obj as any).password;

    // 6) Recast en document (optionnel) ou renvoie l’objet safe
    //    Si tu préfères renvoyer un "plain object" : return obj as any;
    //    Ici on renvoie le doc (mais password est absent en toJSON)
    return doc;
  }
 
}
