import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lista } from './lista.entity';
import { ListaController } from './lista.controller';
import { Usuario } from '../usuarios/usuario.entity';
import { ItemLista } from './item-lista.entity';
import { Produto } from '../produtos/produto.entity';
import { Preco } from '../precos/preco.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lista, ItemLista, Usuario, Produto, Preco])],
  controllers: [ListaController],
})
export class ListaModule {} 
