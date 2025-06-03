import { Repository } from 'typeorm';
import { Mercado } from './mercado.entity';
import { CreateMercadoDto } from './dto/create-mercado.dto';
import { UpdateMercadoDto } from './dto/update-mercado.dto';
import { Preco } from '../admin/preco.entity';
export declare class MercadoController {
    private mercadoRepo;
    private precoRepo;
    constructor(mercadoRepo: Repository<Mercado>, precoRepo: Repository<Preco>);
    listarTodos(): Promise<Mercado[]>;
    criar(body: CreateMercadoDto): Promise<Mercado>;
    buscarPorId(id: string): Promise<Mercado | null>;
    editar(id: string, body: UpdateMercadoDto): Promise<Mercado | null>;
    remover(id: string): Promise<{
        message: string;
    }>;
    listarPrecosPorProduto(produtoId: string): Promise<Preco[]>;
}
