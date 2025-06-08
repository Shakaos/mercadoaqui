import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lista } from './lista.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { ItemLista } from './item-lista.entity';
import { Produto } from '../produtos/produto.entity';
import { Preco } from '../precos/preco.entity';
import { Mercado } from '../mercados/mercado.entity';

@Controller('historico')
export class ListaController {
  constructor(
    @InjectRepository(Lista) private listaRepo: Repository<Lista>,
    @InjectRepository(ItemLista) private itemListaRepo: Repository<ItemLista>,
    @InjectRepository(Produto) private produtoRepo: Repository<Produto>,
    @InjectRepository(Preco) private precoRepo: Repository<Preco>,
    @InjectRepository(Mercado) private mercadoRepo: Repository<Mercado>,
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
  ) {}

  @Get()
  async listarHistorico() {
    const listas = await this.listaRepo.find({ relations: ['usuario'] });
    const historico: any[] = [];
    for (const lista of listas) {
      const itens = await this.itemListaRepo.find({ where: { lista: { id: lista.id } }, relations: ['produto'] });
      let total = 0;
      for (const item of itens) {
        const precos = await this.precoRepo.find({ where: { produto: { id: item.produto.id } }, relations: ['mercado'] });
        const menorPreco = precos.sort((a, b) => a.preco - b.preco)[0];
        if (menorPreco) {
          total += menorPreco.preco * item.quantidade;
        }
      }
      historico.push({
        id: lista.id,
        nome: lista.nome,
        usuario: lista.usuario?.nome,
        total,
        data_hora: lista.criada_em,
        mercado: 'Vários',
      });
    }
    return historico;
  }

  @Get('lista/:id')
  async compararLista(@Param('id') id: number) {
    const lista = await this.listaRepo.findOne({ where: { id }, relations: ['usuario'] });
    const itens = await this.itemListaRepo.find({ where: { lista: { id } }, relations: ['produto'] });
    const mercados = await this.mercadoRepo.find();

    const comparacoes: any[] = [];

    for (const mercado of mercados) {
      let total = 0;
      for (const item of itens) {
        const preco = await this.precoRepo.findOne({ where: { produto: { id: item.produto.id }, mercado: { id: mercado.id } } });
        if (preco) {
          total += preco.preco * item.quantidade;
        }
      }
      comparacoes.push({
        mercado: mercado.nome,
        total,
      });
    }

    return comparacoes;
  }
}
