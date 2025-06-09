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
    private readonly listaRepo: Repository<Lista>,

    @InjectRepository(ItemLista)
    private readonly itemListaRepo: Repository<ItemLista>,

    @InjectRepository(Produto)
    private readonly produtoRepo: Repository<Produto>,

    @InjectRepository(Preco)
    private readonly precoRepo: Repository<Preco>,

    @InjectRepository(Mercado)
    private readonly mercadoRepo: Repository<Mercado>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  @Get()
  async listarHistorico() {
    return this.listaRepo.find({
      relations: ['usuario', 'mercado'],
      order: { criada_em: 'DESC' },
    });
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

    const mercadosMap: Record<
      string,
      { total: number; produtos: Preco[] }
    > = {};

    for (const preco of precos) {
      const nomeMercado = preco.mercado.nome;

      if (!mercadosMap[nomeMercado]) {
        mercadosMap[nomeMercado] = { total: 0, produtos: [] };
      }

      mercadosMap[nomeMercado].produtos.push(preco);
      mercadosMap[nomeMercado].total += Number(preco.valor || 0);
    }

    const entradaOrdenada = Object.entries(mercadosMap)
      .filter(([_, dados]) => dados.total > 0)
      .sort((a, b) => a[1].total - b[1].total);

    if (entradaOrdenada.length === 0) {
      return [];
    }

    const [mercadoVencedorNome, dados] = entradaOrdenada[0];

    const mercado = await this.mercadoRepo.findOne({
      where: { nome: mercadoVencedorNome },
    });

    if (!mercado) {
      return { error: 'Mercado não encontrado' };
    }

    const novaLista = this.listaRepo.create({
      nome: `Comparação - ${new Date().toLocaleString('pt-BR')}`,
      mercado,
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

    return entradaOrdenada.map(([nomeMercado, dados]) => ({
      mercado: nomeMercado,
      total: Number(dados.total || 0),
      produtos: dados.produtos.map(p => ({
        nome: p.produto.nome,
        preco: Number(p.valor || 0),
      })),
    }));
  }
}
