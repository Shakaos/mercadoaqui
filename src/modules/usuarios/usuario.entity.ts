// mercadoaqui-api/src/modules/usuarios/usuario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha: string;

  @Column({ default: 'cliente' })
  tipo: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;
}
