import { Test, TestingModule } from '@nestjs/testing';
import { CancelOrderUseCase } from '../../../src/application/use-cases/commands/cancel-order.use-case';
import { IOrderRepository } from '../../../src/domain/interfaces/order-repository.interface';
import { IEventBus } from '../../../src/domain/interfaces/event-bus.interface';
import { InventoryGrpcClient } from '../../../src/infrastructure/grpc/clients/inventory-grpc.client';
import { CancelOrderCommand } from '../../../src/application/dto/request/cancel-order.command';
import { Order } from '../../../src/domain/aggregates/order.aggregate';
import { OrderStatus, PaymentStatus } from '@prisma/client';

describe('CancelOrderUseCase', () => {
  let useCase: CancelOrderUseCase;
  let orderRepository: jest.Mocked<IOrderRepository>;
  let inventoryClient: jest.Mocked<InventoryGrpcClient>;
  let eventBus: jest.Mocked<IEventBus>;

  const mockOrder = Order.create({
    id: 'order-1',
    orderNumber: 'ORD-2026-000001',
    userId: 'user-1',
    items: [{ id: '1', productId: 'p1', sku: 'SKU-1', name: 'Product', quantity: 2, price: 100, reservationId: 'res-1' }],
    subtotal: 200,
    taxAmount: 40,
    shippingCost: 30,
    discount: 0,
    totalAmount: 270,
    currency: 'MAD',
    shippingAddress: { name: 'John', phone: '123', address: 'St', city: 'City', postalCode: '12345' },
  });

  beforeEach(async () => {
    const mockRepo = {
      save: jest.fn(),
      findById: jest.fn(),
      findByOrderNumber: jest.fn(),
      findByUserId: jest.fn(),
      search: jest.fn(),
      delete: jest.fn(),
    };

    const mockInventory = {
      reserveStock: jest.fn(),
      releaseReservation: jest.fn(),
      checkAvailability: jest.fn(),
    };

    const mockEventBus = {
      publish: jest.fn(),
      publishAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancelOrderUseCase,
        { provide: IOrderRepository, useValue: mockRepo },
        { provide: InventoryGrpcClient, useValue: mockInventory },
        { provide: IEventBus, useValue: mockEventBus },
      ],
    }).compile();

    useCase = module.get<CancelOrderUseCase>(CancelOrderUseCase);
    orderRepository = module.get(IOrderRepository);
    inventoryClient = module.get(InventoryGrpcClient);
    eventBus = module.get(IEventBus);
  });

  it('should cancel order successfully', async () => {
    orderRepository.findById.mockResolvedValue(mockOrder);

    const command = new CancelOrderCommand('order-1', 'user-1', 'Customer request');

    await useCase.execute(command);

    expect(orderRepository.save).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
  });

  it('should throw error if order not found', async () => {
    orderRepository.findById.mockResolvedValue(null);

    const command = new CancelOrderCommand('order-1', 'user-1', 'Reason');

    await expect(useCase.execute(command)).rejects.toThrow('Order not found');
  });

  it('should throw error if user unauthorized', async () => {
    orderRepository.findById.mockResolvedValue(mockOrder);

    const command = new CancelOrderCommand('order-1', 'other-user', 'Reason');

    await expect(useCase.execute(command)).rejects.toThrow('Unauthorized');
  });

  it('should release inventory reservations', async () => {
    orderRepository.findById.mockResolvedValue(mockOrder);

    const command = new CancelOrderCommand('order-1', 'user-1', 'Reason');

    await useCase.execute(command);

    expect(inventoryClient.releaseReservation).toHaveBeenCalledWith({
      reservationId: 'res-1',
    });
  });
});
