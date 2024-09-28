import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { handleFilter } from '../../shared/helpers/sql.helper';
import { IFindAllFilter } from '../../shared/interfaces/find-all-filter.interface';
import { IFindAllOrder } from '../../shared/interfaces/find-all-order.interface';
import { IResponse } from '../../shared/interfaces/response.interface';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { CreateVendaDto } from './dto/create-venda.dto';
import { UpdateVendaDto } from './dto/update-venda.dto';
import { venda } from './entities/venda.entity';

@Injectable()
export class VendaService {
  private readonly logger = new Logger(VendaService.name);

  @Inject('CONTA_RECEBER_SERVICE')
  private readonly contaReceberService: ClientProxy;

  @InjectRepository(venda)
  private repository: Repository<venda>;

  @Inject(RedisCacheService)
  private redisCacheService: RedisCacheService;

  constructor() {}

  async create(createVendaDto: CreateVendaDto): Promise<venda> {
    const created = this.repository.create(new venda(createVendaDto));

    return await this.repository.save(created);
  }

  async findAll(
    page: number,
    size: number,
    order: IFindAllOrder,
    filter?: IFindAllFilter | IFindAllFilter[],
  ): Promise<IResponse<venda[]>> {
    const where = handleFilter(filter);

    const [data, count] = await this.repository.findAndCount({
      loadEagerRelations: false,
      order: { [order.column]: order.sort },
      where,
      skip: size * page,
      take: size,
    });

    return { data, count, message: null };
  }

  async findOne(id: number): Promise<venda> {
    return await this.repository.findOne({
      where: { id: id },
    });
  }

  async update(id: number, updateVendaDto: UpdateVendaDto): Promise<venda> {
    if (id !== updateVendaDto.id) {
      throw new HttpException(
        EMensagem.IDsDiferentes,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return await this.repository.save(new venda(updateVendaDto));
  }

  async delete(id: number): Promise<boolean> {
    return await this.repository
      .delete(id)
      .then((result) => result.affected === 1);
  }

  async findTotais(mesAtual = false): Promise<number> {
    let dataHoraCondition = `IS NOT NULL`;

    if (mesAtual) {
      dataHoraCondition = `>= date_trunc('month', CURRENT_DATE)`;
    }

    const result: { total: number } = await this.repository
      .createQueryBuilder('venda')
      .select('SUM(venda.valorTotal)', 'total')
      .andWhere('venda.dataHora ' + dataHoraCondition)
      .getRawOne();

    return result.total;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async refreshCache(): Promise<void> {
    const total = await this.findTotais(false);
    const mensal = await this.findTotais(true);

    await this.redisCacheService.set('vendaTotal', total ?? 0);
    await this.redisCacheService.set('vendaMensal', mensal ?? 0);
  }
}
