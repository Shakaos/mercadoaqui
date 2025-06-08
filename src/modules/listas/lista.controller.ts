import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Lista } from './lista.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { ItemLista } from './item-lista.entity';
import { Produto } from '../produtos/produto.entity';
import { Preco } from '../precos/preco.entity';
import { Mercado } from '../mercados/mercado.entity';

@Controller('historico')
export class ListaController {
  constructor(
    @InjectRepository(Lista)
    private listaRepo: Repository<Lista>,

    @InjectRepository(ItemLista)
    private itemListaRepo: Repository<ItemLista>,

    @InjectRepository(Produto)
    private produtoRepo: Repository<Produto>,

    @InjectRepository(Preco)
    private precoRepo: Repository<Preco>,

    @InjectRepository(Mercado)
    private mercadoRepo: Repository<Mercado>,

    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  @Get()
  async listarHistorico() {
    const listas = await this.listaRepo.find({
      relations: ['usuario'],
      order: { criada_em: 'DESC' },
    });

    return listas;
  }

  @Post('/comparar')
  async compararListas(@Body() body: { produtos: number[] }) {
    const { produtos } = body;

    if (!produtos || produtos.length === 0) {
      return [];
    }

    const precos = await this.precoRepo.find({
      where: { produto: { id: In(produtos) } },
      relations: ['produto', 'mercado'],
    });

    const mercadosMap: Record<string, { total: number; produtos: { nome: string; preco: number }[] }> = {};

    for (const preco of precos) {
      const nomeMercado = preco.mercado.nome;

      if (!mercadosMap[nomeMercado]) {
        mercadosMap[nomeMercado] = { total: 0, produtos: [] };
      }

      mercadosMap[nomeMercado].produtos.push({
        nome: preco.produto.nome,
        preco: preco.valor,
      });

      mercadosMap[nomeMercado].total += preco.valor;
    }

    return Object.entries(mercadosMap).map(([mercado, dados]) => ({
      mercado,
      total: dados.total,
      produtos: dados.produtos,
    }));
  }
}
