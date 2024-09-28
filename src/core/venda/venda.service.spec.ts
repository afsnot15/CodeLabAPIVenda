import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { IFindAllOrder } from '../../shared/interfaces/find-all-order.interface';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { VendaItem } from './entities/venda-item.entity';
import { venda } from './entities/venda.entity';
import { VendaService } from './venda.service';

describe('VendaService', () => {
  let service: VendaService;
  let repository: Repository<venda>;

  const mockVendaService = {
    emit: jest.fn(),
  };

  const mockRedisCacheService = {
    set: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendaService,
        {
          provide: getRepositoryToken(venda),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            delete: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(VendaItem),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: 'CONTA_RECEBER_SERVICE',
          useValue: mockVendaService,
        },
        {
          provide: RedisCacheService,
          useValue: mockRedisCacheService,
        },
      ],
    }).compile();

    service = module.get<VendaService>(VendaService);

    repository = module.get<Repository<venda>>(getRepositoryToken(venda));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      const spyRepositorySave = jest
        .spyOn(repository, 'save')
        .mockReturnValue(Promise.resolve(mockVenda) as any);

      const response = await service.create(createVendaDto);

      expect(response).toEqual(mockVenda);
      expect(spyRepositorySave).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('obter uma listagem de conta receber', async () => {
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

      const resultExpected = {
        count: 1,
        data: mockListVenda,
        message: null,
      };

      const spyRepositoryFindAndCount = jest
        .spyOn(repository, 'findAndCount')
        .mockReturnValue(Promise.resolve([mockListVenda, 1]) as any);

      const order: IFindAllOrder = { column: 'id', sort: 'asc' };

      const response = await service.findAll(1, 10, order);

      expect(response).toEqual(resultExpected);
      expect(spyRepositoryFindAndCount).toHaveBeenCalled();
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

      const spyRepositoryFindOne = jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(Promise.resolve(mockVenda) as any);

      const response = await service.findOne(1);

      expect(response).toEqual(mockVenda);
      expect(spyRepositoryFindOne).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('alterar uma venda', async () => {
      const updateVendaDto = {
        id: 1,
        idPessoa: 1,
        pessoa: 'pessoa',
        idUsuarioLancamento: 1,
        valorTotal: 150,
        formaPagamento: 1,
        itens: [],
      };

      const mockVenda = Object.assign(updateVendaDto, {});

      const spyRepositorySave = jest
        .spyOn(repository, 'save')
        .mockReturnValue(Promise.resolve(mockVenda) as any);

      const response = await service.update(1, updateVendaDto);

      expect(response).toEqual(updateVendaDto);
      expect(spyRepositorySave).toHaveBeenCalled();
    });

    it('lançar erro ao enviar ids diferentes quando alterar uma venda', async () => {
      const updateVendaDto = {
        id: 1,
        idPessoa: 1,
        pessoa: 'pessoa',
        idUsuarioLancamento: 1,
        valorTotal: 150,
        formaPagamento: 1,
        itens: [],
      };

      try {
        await service.update(2, updateVendaDto);
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(EMensagem.IDsDiferentes);
      }
    });
  });

  describe('deletar', () => {
    it('deletar uma venda', async () => {
      const spyRepositoryDelete = jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1, raw: null } as any);

      const response = await service.delete(1);

      expect(response).toEqual(true);
      expect(spyRepositoryDelete).toHaveBeenCalled();
    });
  });
});
