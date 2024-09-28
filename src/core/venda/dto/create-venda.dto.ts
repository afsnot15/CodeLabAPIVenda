import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';
import { EMensagem } from '../../../shared/enums/mensagem.enum';
import { CreateVendaItemDto } from './create-venda-item.dto';
import { UpdateVendaItemDto } from './update-vendaitem.dto';

export class CreateVendaDto {
  @IsNotEmpty({ message: `idPessoa ${EMensagem.NaoPodeSerVazio}` })
  idPessoa: number;

  @IsNotEmpty({ message: `pessoa ${EMensagem.NaoPodeSerVazio}` })
  pessoa: string;

  @IsNotEmpty({ message: `idUsuarioLancamento ${EMensagem.NaoPodeSerVazio}` })
  idUsuarioLancamento: number;

  @IsNotEmpty({ message: `valorTotal ${EMensagem.NaoPodeSerVazio}` })
  valorTotal: number;

  @IsNotEmpty({ message: `formaPagamento ${EMensagem.NaoPodeSerVazio}` })
  formaPagamento: number;

  @IsArray({ message: `itens ${EMensagem.TipoInvalido}` })
  @IsNotEmpty({ message: `itens ${EMensagem.NaoPodeSerVazio}` })
  @Type(() => CreateVendaItemDto)
  itens: CreateVendaItemDto[] | UpdateVendaItemDto[];
}
