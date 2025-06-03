import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './produto.entity';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { Preco } from '../precos/preco.entity';
import { Mercado } from '../mercados/mercado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, Preco, Mercado])],
  controllers: [ProdutoController],
  providers: [ProdutoService],
})
export class ProdutoModule {}