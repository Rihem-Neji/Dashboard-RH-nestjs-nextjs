import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OffersModule } from './offers/offers.module';
import { CandidaturesModule } from './candidatures/candidatures.module'; // ou ApplicationsModule si tu l’as nommé ainsi

@Module({
  imports: [
    ConfigModule.forRoot({  isGlobal: true, // Rend le ConfigService disponible partout
      envFilePath: '.env', // Spécifie le chemin du fichier .env (optionnel, c'est la valeur par défaut)
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AuthModule,
    UsersModule,
    OffersModule,
    CandidaturesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
