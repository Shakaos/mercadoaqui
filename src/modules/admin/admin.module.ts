import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from '../produtos/produto.entity';
import { Mercado } from '../mercados/mercado.entity';
import { Preco } from '../precos/preco.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, Mercado, Preco])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}