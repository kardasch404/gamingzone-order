import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class UnitOfWork {
  constructor(private readonly prisma: PrismaService) {}

  async execute<T>(work: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(async (tx) => {
      return await work(tx);
    });
  }

  async executeWithRetry<T>(
    work: (tx: any) => Promise<T>,
    maxRetries: number = 3,
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.execute(work);
      } catch (error) {
        lastError = error as Error;
        if (attempt === maxRetries) break;
        await this.delay(attempt * 100);
      }
    }

    throw lastError!;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
