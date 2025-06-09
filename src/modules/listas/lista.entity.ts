import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Mercado } from '../mercados/mercado.entity';

@Entity('listas')
export class Lista {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @ManyToOne(() => Mercado, { eager: true })
  @JoinColumn({ name: 'mercado_id' })
  mercado: Mercado;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  criada_em: Date;
}
