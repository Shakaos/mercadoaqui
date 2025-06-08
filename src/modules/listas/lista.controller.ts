import {
  Controller,
  Get,
  Post,
  Body,
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
    private produtoRepo: Repository(Produto),

    @InjectRepository(Preco)
    private precoRepo: Repository(Preco),

    @InjectRepository(Mercado)
    private mercadoRepo: Repository(Mercado),

    @InjectRepository(Usuario)
    private usuarioRepo: Repository(Usuario),
  ) {}

  @Get()
  async listarHistorico() {
    const listas = await this.listaRepo.find({
      relations: ['mercado'],
      order: { criada_em: 'DESC' },
    });

    return listas;
  }

  @Post('/comparar')
  async compararListas(@Body() body: { produtos: number[] }) {
    const { produtos } = body;

    if (!produtos || produtos.length === 0) return [];

    const precos = await this.precoRepo.find({
      where: { produto: { id: In(produtos) } },
      relations: ['produto', 'mercado'],
    });

    const mercadosMap: Record<string, { produtos: Preco[]; total: number }> = {};

    for (const preco of precos) {
      const nome = preco.mercado.nome;

      if (!mercadosMap[nome]) {
        mercadosMap[nome] = { produtos: [], total: 0 };
      }

      mercadosMap[nome].produtos.push(preco);
      mercadosMap[nome].total += preco.valor;
    }

    const ordenado = Object.entries(mercadosMap).sort(
      (a, b) => a[1].total - b[1].total
    );

    const [mercadoNome, dados] = ordenado[0];

    const mercado = await this.mercadoRepo.findOne({
      where: { nome: mercadoNome },
    });

    if (!mercado) throw new Error('Mercado não encontrado');

    const novaLista = this.listaRepo.create({
      nome: `Comparação - ${new Date().toLocaleString('pt-BR')}`,
      mercado: mercado,
      total: dados.total,
      criada_em: new Date(),
    });

    const listaSalva = await this.listaRepo.save(novaLista);

    const itens = dados.produtos.map((preco) =>
      this.itemListaRepo.create({
        lista: listaSalva,
        produto: preco.produto,
        quantidade: 1,
      })
    );

    await this.itemListaRepo.save(itens);

    return ordenado.map(([nome, dados]) => ({
      mercado: nome,
      total: dados.total,
      produtos: dados.produtos.map(p => ({
        nome: p.produto.nome,
        preco: p.valor,
      })),
    }));
  }
}
