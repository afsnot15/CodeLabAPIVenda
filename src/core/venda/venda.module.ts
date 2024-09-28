import { Module } from '@nestjs/common';
import { ClientProxy, Closeable } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportPdfService } from '../../shared/services/export-pdf.service';
import { RmqClientService } from '../../shared/services/rmq-client.service';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';
import { VendaItem } from './entities/venda-item.entity';
import { venda } from './entities/venda.entity';
import { VendaController } from './venda.controller';
import { VendaService } from './venda.service';

@Module({
  imports: [TypeOrmModule.forFeature([venda, VendaItem]), RedisCacheModule],
  controllers: [VendaController],
  providers: [
    VendaService,
    ExportPdfService,
    RmqClientService,
    {
      provide: 'CONTA_RECEBER_SERVICE',
      useFactory: async (
        rmqClientService: RmqClientService,
      ): Promise<ClientProxy & Closeable> => {
        return rmqClientService.createRabbitmqOptions(
          'financeiro.create-conta-receber',
        );
      },
      inject: [RmqClientService],
    },
  ],
})
export class VendaModule {}
