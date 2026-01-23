import { Test, TestingModule } from '@nestjs/testing';
import { OrderNumberGenerator } from '../../../src/domain/services/order-number-generator.service';
import { PrismaService } from '../../../src/infrastructure/database/prisma/prisma.service';

describe('OrderNumberGenerator', () => {
  let service: OrderNumberGenerator;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrisma = {
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderNumberGenerator,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OrderNumberGenerator>(OrderNumberGenerator);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate order number with correct format', async () => {
    const year = new Date().getFullYear();
    const mockSequence = { year, lastNumber: 1, id: 'test', updatedAt: new Date() };

    (prismaService.$transaction as jest.Mock).mockImplementation(async (callback) => {
      return await callback({ orderSequence: { upsert: jest.fn().mockResolvedValue(mockSequence) } });
    });

    const orderNumber = await service.generate();
    expect(orderNumber).toMatch(/^ORD-\d{4}-\d{6}$/);
    expect(orderNumber).toBe(`ORD-${year}-000001`);
  });

  it('should pad number with zeros', async () => {
    const year = new Date().getFullYear();
    const mockSequence = { year, lastNumber: 42, id: 'test', updatedAt: new Date() };

    (prismaService.$transaction as jest.Mock).mockImplementation(async (callback) => {
      return await callback({ orderSequence: { upsert: jest.fn().mockResolvedValue(mockSequence) } });
    });

    const orderNumber = await service.generate();
    expect(orderNumber).toBe(`ORD-${year}-000042`);
  });

  it('should handle large numbers', async () => {
    const year = new Date().getFullYear();
    const mockSequence = { year, lastNumber: 999999, id: 'test', updatedAt: new Date() };

    (prismaService.$transaction as jest.Mock).mockImplementation(async (callback) => {
      return await callback({ orderSequence: { upsert: jest.fn().mockResolvedValue(mockSequence) } });
    });

    const orderNumber = await service.generate();
    expect(orderNumber).toBe(`ORD-${year}-999999`);
  });
});
