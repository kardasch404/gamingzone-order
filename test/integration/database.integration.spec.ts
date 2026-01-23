import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../../src/infrastructure/database/database.module';
import { PrismaService } from '../../src/infrastructure/database/prisma/prisma.service';

describe('DatabaseModule Integration', () => {
  let module: TestingModule;
  let prismaService: PrismaService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should provide PrismaService', () => {
    expect(prismaService).toBeDefined();
    expect(prismaService).toBeInstanceOf(PrismaService);
  });

  it('should export PrismaService', () => {
    const exportedService = module.get<PrismaService>(PrismaService);
    expect(exportedService).toBe(prismaService);
  });
});
