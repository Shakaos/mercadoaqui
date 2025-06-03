import { Repository } from 'typeorm';
import { Produto } from './produto.entity';
import { Preco } from '../admin/preco.entity';
import { Mercado } from '../admin/mercado.entity';
export declare class ProdutoService {
    private readonly produtoRepo;
    private readonly precoRepo;
    private readonly mercadoRepo;
    constructor(produtoRepo: Repository<Produto>, precoRepo: Repository<Preco>, mercadoRepo: Repository<Mercado>);
    listarTodos(): Promise<Produto[]>;
    listarComPrecos(): Promise<any[]>;
}
