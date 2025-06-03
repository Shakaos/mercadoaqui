import { Produto } from '../produtos/produto.entity';
import { Mercado } from './mercado.entity';
export declare class Preco {
    id: number;
    produto: Produto;
    mercado: Mercado;
    preco: number;
    atualizado_em: Date;
}
