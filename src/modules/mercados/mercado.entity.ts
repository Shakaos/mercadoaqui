import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Produto } from '../produtos/produto.entity';

@Entity('mercados')
export class Mercado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @OneToMany(() => Produto, (produto) => produto.mercado)
  produtos: Produto[];

  @Column()
  endereco: string;
}
