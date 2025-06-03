import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mercados')
export class Mercado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  endereco: string;
}