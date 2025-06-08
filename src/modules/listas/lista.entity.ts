import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total: number;

  @ManyToOne(() => Mercado, { eager: true })
  mercado: Mercado;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  criada_em: Date;
} 
