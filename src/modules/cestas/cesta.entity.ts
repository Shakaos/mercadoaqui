import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Mercado } from '../mercados/mercado.entity';
import { CestaProduto } from './cesta_produto.entity';

@Entity('cestas_basicas')
export class CestaBasica {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Mercado)
  @JoinColumn({ name: 'mercado_id' })
  mercado: Mercado;

  @Column({ type: 'datetime' })
  data_atualizacao: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  preco_total: number;

  @OneToMany(() => CestaProduto, cestaProduto => cestaProduto.cesta, { cascade: true })
  produtos: CestaProduto[];
}
