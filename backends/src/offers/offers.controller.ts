import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Swagger (au cas par cas)
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('offers')

//@UseGuards(JwtAuthGuard, RolesGuard)
//@Roles('RH')

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  // ---------- PUBLIC ----------
  @Get()
  @ApiResponse({ status: 200, description: 'Liste des offres' })
  findAll() {
    return this.offersService.findAll();
  }

  // Laisse-le PUBLIC si tu veux l’utiliser sur la Home ou une page détail publique.
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Offre par id' })
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  // ---------- PRIVÉ (JWT) ----------
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiBody({ type: CreateOfferDto })
  @ApiResponse({ status: 201, description: 'Offre créée' })
  create(@Body() dto: CreateOfferDto) {
    return this.offersService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiBody({ type: UpdateOfferDto })
  @ApiResponse({ status: 200, description: 'Offre mise à jour' })
  update(@Param('id') id: string, @Body() dto: UpdateOfferDto) {
    return this.offersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Offre supprimée' })
  remove(@Param('id') id: string) {
    return this.offersService.remove(id);
  }
}
