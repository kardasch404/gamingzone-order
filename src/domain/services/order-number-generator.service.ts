import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';

@Injectable()
export class OrderNumberGenerator {
  constructor(private readonly prisma: PrismaService) {}

  async generate(): Promise<string> {
    const year = new Date().getFullYear();
    
    const orderNumber = await this.prisma.$transaction(async (tx) => {
      const sequence = await tx.orderSequence.upsert({
        where: { year },
        create: { year, lastNumber: 1 },
        update: { lastNumber: { increment: 1 } },
      });

      const paddedNumber = sequence.lastNumber.toString().padStart(6, '0');
      return `ORD-${year}-${paddedNumber}`;
    });

    return orderNumber;
  }
}
