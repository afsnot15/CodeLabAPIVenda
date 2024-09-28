import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateVendaDto } from '../dto/create-venda.dto';
import { UpdateVendaDto } from '../dto/update-venda.dto';
import { VendaItem } from './venda-item.entity';

@Entity('venda')
export class venda {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'pk_venda' })
  id: number;

  @Column({ nullable: false })
  idPessoa: number;

  @Column({ type: 'character varying', length: 100, nullable: false })
  pessoa: string;

  @Column({ nullable: false })
  idUsuarioLancamento: number;

  @Column({ type: 'numeric', precision: 13, scale: 3, nullable: false })
  valorTotal: number;

  @CreateDateColumn()
  dataHora: Date;

  @Column({ nullable: false })
  formaPagamento: number;

  @OneToMany(() => VendaItem, (adicionar) => adicionar.venda, {
    eager: true,
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
    orphanedRowAction: 'delete',
  })
  itens: VendaItem[];

  constructor(createVendaDto: CreateVendaDto | UpdateVendaDto) {
    Object.assign(this, createVendaDto);
  }
}
