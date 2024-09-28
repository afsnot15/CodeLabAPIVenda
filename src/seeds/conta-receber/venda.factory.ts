import { fakerPT_BR as faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { CreateVendaDto } from '../../core/venda/dto/create-venda.dto';
import { venda } from '../../core/venda/entities/venda.entity';

define(venda, () => {
  const crateVendaDto = new CreateVendaDto();

  crateVendaDto.idPessoa = faker.number.int({ max: 20 });
  crateVendaDto.pessoa = faker.person.fullName().substring(0, 100);
  crateVendaDto.valorTotal = faker.number.float({ min: 0, max: 1000 });
  crateVendaDto.idUsuarioLancamento = 1;
  crateVendaDto.formaPagamento = faker.number.int({ max: 20 });
  crateVendaDto.itens = [];

  return new venda(crateVendaDto);
});
