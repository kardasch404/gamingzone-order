import { Test, TestingModule } from '@nestjs/testing';
import { OrderRepository } from '../../../src/infrastructure/database/repositories/order.repository';
import { PrismaService } from '../../../src/infrastructure/database/prisma/prisma.service';
import { Order } from '../../../src/domain/aggregates/order.aggregate';
import { OrderStatus, PaymentStatus, FulfillmentStatus } from '@prisma/client';

describe('OrderRepository', () => {
  let repository: OrderRepository;
  let prismaService: PrismaService;

  const mockOrder = {
    id: 'order-1',
    orderNumber: 'ORD-2026-000001',
    userId: 'user-1',
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    fulfillmentStatus: FulfillmentStatus.UNFULFILLED,
    subtotal: 200,
    taxAmount: 20,
    shippingCost: 10,
    discount: 0,
    totalAmount: 230,
    currency: 'MAD',
    shippingAddress: { name: 'John', phone: '123', address: 'St', city: 'City', postalCode: '12345' },
    items: [{ id: '1', productId: 'p1', sku: 'SKU-1', name: 'Product', quantity: 1, price: 100 }],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrisma = {
      $transaction: jest.fn((callback) => callback(mockPrisma)),
      order: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<OrderRepository>(OrderRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('save', () => {
    it('should save order', async () => {
      const order = Order.create({
        id: mockOrder.id,
        orderNumber: mockOrder.orderNumber,
        userId: mockOrder.userId,
        items: [{ id: '1', productId: 'p1', quantity: 2, price: 100 }],
        subtotal: mockOrder.subtotal,
        taxAmount: mockOrder.taxAmount,
        shippingCost: mockOrder.shippingCost,
        discount: mockOrder.discount,
        totalAmount: mockOrder.totalAmount,
        currency: mockOrder.currency,
        shippingAddress: mockOrder.shippingAddress,
      });

      await repository.save(order);

      expect(prismaService.$transaction).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find order by id', async () => {
      (prismaService.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);

      const result = await repository.findById('order-1');

      expect(result).toBeDefined();
      expect(prismaService.order.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        include: { items: true },
      });
    });

    it('should return null if order not found', async () => {
      (prismaService.order.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByOrderNumber', () => {
    it('should find order by order number', async () => {
      (prismaService.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);

      const result = await repository.findByOrderNumber('ORD-2026-000001');

      expect(result).toBeDefined();
      expect(prismaService.order.findUnique).toHaveBeenCalledWith({
        where: { orderNumber: 'ORD-2026-000001' },
        include: { items: true },
      });
    });
  });

  describe('findByUserId', () => {
    it('should find orders by user id with pagination', async () => {
      (prismaService.order.findMany as jest.Mock).mockResolvedValue([mockOrder]);
      (prismaService.order.count as jest.Mock).mockResolvedValue(1);

      const result = await repository.findByUserId('user-1', {
        page: 1,
        limit: 10,
        offset: 0,
      });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });
  });

  describe('delete', () => {
    it('should delete order', async () => {
      await repository.delete('order-1');

      expect(prismaService.order.delete).toHaveBeenCalledWith({
        where: { id: 'order-1' },
      });
    });
  });
});
