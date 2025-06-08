import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Mercado } from '../mercados/mercado.entity';
import { Preco } from '../precos/preco.entity';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  categoria: string;

  @Column()
  tipo: string;

  @Column({ type: 'longtext', nullable: true })
  imagem_base64: string;

  @ManyToOne(() => Mercado)
  @JoinColumn({ name: 'mercado_id' })
  mercado: Mercado;

  @OneToMany(() => Preco, (preco) => preco.produto)
  precos: Preco[];
}
