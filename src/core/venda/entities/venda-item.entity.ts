import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateVendaItemDto } from '../dto/create-venda-item.dto';
import { UpdateVendaItemDto } from '../dto/update-vendaitem.dto';
import { venda } from './venda.entity';

@Entity('vendaitem')
export class VendaItem {
  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: 'pk_venda-item',
  })
  id: number;

  @Column({ nullable: false })
  idVenda: number;

  @Column({ nullable: false })
  idProduto: number;

  @Column({ type: 'numeric', precision: 13, scale: 2, nullable: false })
  quantidade: number;

  @Column({ type: 'numeric', precision: 13, scale: 2, nullable: false })
  precoVenda: number;

  @Column({ type: 'numeric', precision: 13, scale: 2, nullable: false })
  valorPago: number;

  @CreateDateColumn()
  dataHora: Date;

  @ManyToOne(() => venda, (contasReceber) => contasReceber.id)
  @JoinColumn({
    name: 'idVenda',
    foreignKeyConstraintName: 'fk_ventaitem_venda',
  })
  venda: venda;

  constructor(createVendaItemDto: CreateVendaItemDto | UpdateVendaItemDto) {
    Object.assign(this, createVendaItemDto);
  }
}
