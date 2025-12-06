import { Module } from '@nestjs/common';
import { CandidaturesService } from './candidatures.service';
import { CandidaturesController } from './candidatures.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Candidature, CandidatureSchema } from './schemas/candidature.schema';
import { AuthModule } from '../auth/auth.module'; // 👈 important
import { OffersModule } from '../offers/offers.module'; // Assurez-vous que le chemin est correct

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Candidature.name, schema: CandidatureSchema },
    ]),
        AuthModule, // 👈 pour injecter TokenBlacklistService & JwtBlacklistGuard

  ],
  providers: [CandidaturesService],
  controllers: [CandidaturesController],
  exports: [CandidaturesService]
})
export class CandidaturesModule {}
