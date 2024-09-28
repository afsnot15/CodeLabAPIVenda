import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { EMensagem } from '../../../shared/enums/mensagem.enum';
import { CreateVendaDto } from './create-venda.dto';

export class UpdateVendaDto extends PartialType(CreateVendaDto) {
  @IsNotEmpty({ message: `ID ${EMensagem.DeveSerInformado}` })
  id: number;
}
