import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Lista } from './lista.entity';
import { Produto } from '../produtos/produto.entity';

@Entity('itens_lista')
export class ItemLista {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lista)
  @JoinColumn({ name: 'lista_id' })
  lista: Lista;

  @ManyToOne(() => Produto)
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @Column({ type: 'int', default: 1 })
  quantidade: number;
} 