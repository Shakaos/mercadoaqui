import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Produto } from '../produtos/produto.entity';
import { Mercado } from '../mercados/mercado.entity';

@Entity('precos')
export class Preco {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Produto)
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @ManyToOne(() => Mercado)
  @JoinColumn({ name: 'mercado_id' })
  mercado: Mercado;

  @Column('decimal', { precision: 10, scale: 2 })
  preco: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  atualizado_em: Date;
}