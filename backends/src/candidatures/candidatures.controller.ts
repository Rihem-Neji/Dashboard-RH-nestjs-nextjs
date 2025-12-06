import {
  Body, Controller, Delete, Get, Param, Post, Put, Query,
  UseGuards, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, BadRequestException
} from '@nestjs/common';
import { CandidaturesService } from './candidatures.service';
import { CreateCandidatureDto } from './dto/create-candidature.dto';
import { UpdateCandidatureDto } from './dto/update-candidature.dto';
import { QueryCandidatureDto } from './dto/query-candidature.dto';
import { JwtBlacklistGuard } from '../auth/guards/jwt-blacklist.guard';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { extname } from 'path';
import type { Express } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('candidatures')
@Controller('candidatures')
export class CandidaturesController {
  constructor(private readonly service: CandidaturesService) {}


   @Post()
  @UseInterceptors(FileInterceptor('cv', {
    storage: diskStorage({
      destination: (_req, _file, cb) => {
        const dest = path.join(process.cwd(), 'uploads', 'cv');
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
      },
      filename: (_req, file, cb) => {
        const rnd = Math.random().toString(36).slice(2, 8);
        cb(null, `${Date.now()}-${rnd}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (_req, file, cb) => {
      const ok = file.mimetype === 'application/pdf';
      cb(ok ? null : new Error('PDF uniquement'), ok);
    },
    limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  }))
  async create(
    @Body() dto: CreateCandidatureDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Le CV (PDF) est requis (champ "cv").');
    }
    return this.service.createWithFile(dto, {
      cvUrl: `/uploads/cv/${file.filename}`,
      cvOriginalName: file.originalname,
      cvMimeType: file.mimetype,
      cvSize: file.size,
    });
  }
  // ///PUBLIC : postuler
  //@UsePipes(new ValidationPipe({ whitelist: true }))
  //@Post()
//  @ApiResponse({ status: 201, description: 'Candidature créée' })
////////  //create(@Body() dto: CreateCandidatureDto) {
    ////////return this.service.create(dto);
  ///////////}

  // PROTÉGÉ : get ALL (sans filtre)
  @UseGuards(JwtBlacklistGuard)

  //@UseGuards(JwtAuthGuard, RolesGuard)
 // @Roles('RH')

  @ApiBearerAuth('access-token')
  @Get()
  @ApiResponse({ status: 200, description: 'Toutes les candidatures' })
  findAll() {
    return this.service.findAll();
  }

  // PROTÉGÉ : recherche par status / id_offre (optionnels)
  @UseGuards(JwtBlacklistGuard)
  @ApiBearerAuth('access-token')
  @Get('search')
  @ApiQuery({ name: 'status', required: false, enum: ['submitted','pending','accepted','rejected'] })
  @ApiQuery({ name: 'id_offre', required: false })
  search(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    q: QueryCandidatureDto,
  ) {
    return this.service.search(q);
  }

  // PROTÉGÉ : détail par id
  @UseGuards(JwtBlacklistGuard)

  //@UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles('RH')

  @ApiBearerAuth('access-token')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // (update/remove protégés inchangés)
  @UseGuards(JwtBlacklistGuard)

 // @UseGuards(JwtAuthGuard, RolesGuard)
  //@Roles('RH')
  
  @ApiBearerAuth('access-token')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCandidatureDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtBlacklistGuard)
  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
