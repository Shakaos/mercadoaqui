import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { CestaBasica } from './cesta.entity';
import { Produto } from '../produtos/produto.entity';

@Entity('cesta_produto')
export class CestaProduto {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CestaBasica, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cesta_id' })
  cesta: CestaBasica;

  @ManyToOne(() => Produto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  // Opcional: quantidade do produto na cesta
  @Column({ type: 'int', default: 1 })
  quantidade: number;

  @Column('decimal', { precision: 10, scale: 2 })
  preco: number;
} 
