import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn
} from 'typeorm';
import { Mercado } from '../mercados/mercado.entity';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  categoria: string;

  @Column({ nullable: true })
  tipo: string;

  @Column({ type: 'text', nullable: true })
  imagem_base64: string;

  @OneToMany(() => Preco, (preco) => preco.produto)
  precos: Preco[];

  @ManyToOne(() => Mercado, { eager: true, nullable: false })
  @JoinColumn({ name: 'mercado_id' })
  mercado: Mercado;
}
