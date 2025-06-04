import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({ default: false })
  aprovado: boolean;

  @Column({ type: 'text', nullable: true })
  imagem_base64: string;
}
