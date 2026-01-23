import { Test, TestingModule } from '@nestjs/testing';
import { UnitOfWork } from '../../../src/infrastructure/database/unit-of-work';
import { PrismaService } from '../../../src/infrastructure/database/prisma/prisma.service';

describe('UnitOfWork', () => {
  let unitOfWork: UnitOfWork;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const mockPrisma = {
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitOfWork,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    unitOfWork = module.get<UnitOfWork>(UnitOfWork);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('execute', () => {
    it('should execute work in transaction', async () => {
      const mockWork = jest.fn().mockResolvedValue('result');
      (prismaService.$transaction as jest.Mock).mockImplementation((callback) =>
        callback({}),
      );

      await unitOfWork.execute(mockWork);

      expect(prismaService.$transaction).toHaveBeenCalled();
    });
  });

  describe('executeWithRetry', () => {
    it('should retry on failure', async () => {
      const mockWork = jest.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValue('success');

      (prismaService.$transaction as jest.Mock).mockImplementation((callback) =>
        callback({}),
      );

      const result = await unitOfWork.executeWithRetry(mockWork, 3);

      expect(result).toBe('success');
    });

    it('should throw after max retries', async () => {
      const mockWork = jest.fn().mockRejectedValue(new Error('Always fail'));
      (prismaService.$transaction as jest.Mock).mockImplementation((callback) =>
        callback({}),
      );

      await expect(unitOfWork.executeWithRetry(mockWork, 2)).rejects.toThrow(
        'Always fail',
      );
    });
  });
});
