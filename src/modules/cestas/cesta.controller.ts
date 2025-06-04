import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CestaBasica } from './cesta.entity';
import { Mercado } from '../mercados/mercado.entity';

@Controller('cestas')
export class CestaController {
  constructor(
    @InjectRepository(CestaBasica)
    private cestaRepo: Repository<CestaBasica>,
    @InjectRepository(Mercado)
    private mercadoRepo: Repository<Mercado>,
  ) {}

  @Get()
  async listarCestas() {
    return this.cestaRepo.find({ relations: ['mercado'] });
  }
} 