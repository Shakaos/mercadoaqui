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

  const mercadosMap: Record<string, { total: number; produtos: Preco[] }> = {};

  for (const preco of precos) {
    const nomeMercado = preco.mercado.nome;

    if (!mercadosMap[nomeMercado]) {
      mercadosMap[nomeMercado] = { total: 0, produtos: [] };
    }

    mercadosMap[nomeMercado].produtos.push(preco);
    mercadosMap[nomeMercado].total += preco.valor;
  }

  const entradaOrdenada = Object.entries(mercadosMap).sort(
    (a, b) => a[1].total - b[1].total
  );

  const [mercadoVencedorNome, dados] = entradaOrdenada[0];

  const mercadoEntity = await this.mercadoRepo.findOne({
    where: { nome: mercadoVencedorNome },
  });

  if (!mercadoEntity) {
    throw new Error('Mercado não encontrado');
  }

  const novaLista = this.listaRepo.create({
    mercado: mercadoEntity, // ✅ entidade correta
    total: dados.total,
    criada_em: new Date(),
  });

  const listaSalva = await this.listaRepo.save(novaLista);

  const itens = dados.produtos.map((preco) =>
    this.itemListaRepo.create({
      lista: listaSalva, // ✅ entidade correta
      produto: preco.produto,
      preco: preco.valor,
    })
  );

  await this.itemListaRepo.save(itens);

  return entradaOrdenada.map(([mercado, dados]) => ({
    mercado,
    total: dados.total,
    produtos: dados.produtos.map((p) => ({
      nome: p.produto.nome,
      preco: p.valor,
    })),
  }));
}
