import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mercado } from './mercado.entity';
import { MercadoController } from './mercado.controller';
import { Preco } from '../precos/preco.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mercado, Preco])],
  controllers: [MercadoController],
  exports: [TypeOrmModule],
})
export class MercadoModule {}