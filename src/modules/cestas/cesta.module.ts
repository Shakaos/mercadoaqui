import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CestaBasica } from './cesta.entity';
import { CestaController } from './cesta.controller';
import { Mercado } from '../mercados/mercado.entity';
import { CestaProduto } from './cesta_produto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CestaBasica, Mercado, CestaProduto])],
  controllers: [CestaController],
})
export class CestaModule {} 
