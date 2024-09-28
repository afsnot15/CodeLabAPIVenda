import { Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { IFindAllOrder } from '../../shared/interfaces/find-all-order.interface';
import { VendaController } from './venda.controller';
import { VendaService } from './venda.service';
describe('VendaController', () => {
  let controller: VendaController;
  let service: VendaService;
  let context: RmqContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendaController],
      providers: [
        {
          provide: VendaService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            exportPdf: jest.fn(),
            baixar: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VendaController>(VendaController);
    service = module.get<VendaService>(VendaService);
    context = {
      getChannelRef: jest.fn().mockReturnValue({
        ack: jest.fn(),
        nack: jest.fn(),
      }),
      getMessage: jest.fn().mockReturnValue({}),
    } as unknown as RmqContext;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('criar uma nova venda', async () => {
      const createVendaDto = {
        idPessoa: 1,
        pessoa: 'pessoa',
        idUsuarioLancamento: 1,
        valorTotal: 150,
        formaPagamento: 1,
        itens: [],
      };

      const mockVenda = Object.assign(createVendaDto, { id: 1 });

      const spyServiceCreate = jest
        .spyOn(service, 'create')
        .mockReturnValue(Promise.resolve(mockVenda) as any);

      const response = await controller.create(createVendaDto);

      expect(response.message).toEqual(EMensagem.SalvoSucesso);
      expect(response.data).toEqual(mockVenda);
      expect(spyServiceCreate).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('obter uma listagem de venda', async () => {
      const mockListVenda = [
        {
          idPessoa: 1,
          pessoa: 'pessoa',
          idUsuarioLancamento: 1,
          valorTotal: 150,
          formaPagamento: 1,
          itens: [],
        },
      ];

      const spyServiceFindAll = jest.spyOn(service, 'findAll').mockReturnValue(
        Promise.resolve({
          data: mockListVenda,
          count: 1,
          message: null,
        }) as any,
      );

      const order: IFindAllOrder = { column: 'id', sort: 'asc' };
      const response = await controller.findAll(1, 10, order);

      expect(spyServiceFindAll).toHaveBeenCalledWith(1, 10, order, undefined);
      expect(response.data).toEqual(mockListVenda);
      expect(spyServiceFindAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('obter uma venda', async () => {
      const mockVenda = {
        idPessoa: 1,
        pessoa: 'pessoa',
        idUsuarioLancamento: 1,
        valorTotal: 150,
        formaPagamento: 1,
        itens: [],
      };
      const spyServiceFindOne = jest
        .spyOn(service, 'findOne')
        .mockReturnValue(Promise.resolve(mockVenda) as any);

      const response = await controller.findOne(1);

      expect(response.message).toEqual(undefined);
      expect(response.data).toEqual(mockVenda);
      expect(spyServiceFindOne).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('alterar uma venda', async () => {
      const mockVenda = {
        id: 1,
        idPessoa: 1,
        pessoa: 'pessoa',
        idUsuarioLancamento: 1,
        valorTotal: 150,
        formaPagamento: 1,
        itens: [],
      };

      const spyServiceUpdate = jest
        .spyOn(service, 'update')
        .mockReturnValue(Promise.resolve(mockVenda) as any);

      const response = await controller.update(1, mockVenda);

      expect(response.message).toEqual(EMensagem.AtualizadoSucesso);
      expect(response.data).toEqual(mockVenda);
      expect(spyServiceUpdate).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('remover uma venda', async () => {
      const spyServiceUpdate = jest
        .spyOn(service, 'delete')
        .mockReturnValue(Promise.resolve(false) as any);

      const response = await controller.delete(1);

      expect(response.message).toEqual(EMensagem.ExcluidoSucesso);
      expect(response.data).toEqual(false);
      expect(spyServiceUpdate).toHaveBeenCalled();
    });
  });
});
