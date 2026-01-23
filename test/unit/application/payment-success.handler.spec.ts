import { Test, TestingModule } from '@nestjs/testing';
import { PaymentSuccessHandler, PaymentSucceededEvent } from '../../../src/application/events/handlers/payment-success.handler';
import { IOrderRepository } from '../../../src/domain/interfaces/order-repository.interface';
import { IEventBus } from '../../../src/domain/interfaces/event-bus.interface';
import { InventoryGrpcClient } from '../../../src/infrastructure/grpc/clients/inventory-grpc.client';
import { IdempotencyService } from '../../../src/application/services/idempotency.service';
import { Order } from '../../../src/domain/aggregates/order.aggregate';

describe('PaymentSuccessHandler', () => {
  let handler: PaymentSuccessHandler;
  let orderRepository: jest.Mocked<IOrderRepository>;
  let inventoryClient: jest.Mocked<InventoryGrpcClient>;
  let eventBus: jest.Mocked<IEventBus>;
  let idempotency: jest.Mocked<IdempotencyService>;

  const mockOrder = Order.create({
    id: 'order-1',
    orderNumber: 'ORD-2026-000001',
    userId: 'user-1',
    items: [{ id: '1', productId: 'p1', sku: 'SKU-1', name: 'Product', quantity: 2, price: 100 }],
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

    const mockIdempotency = {
      isEventProcessed: jest.fn().mockResolvedValue(false),
      markEventProcessed: jest.fn(),
      clearProcessedEvents: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentSuccessHandler,
        { provide: IOrderRepository, useValue: mockRepo },
        { provide: InventoryGrpcClient, useValue: mockInventory },
        { provide: IEventBus, useValue: mockEventBus },
        { provide: IdempotencyService, useValue: mockIdempotency },
      ],
    }).compile();

    handler = module.get<PaymentSuccessHandler>(PaymentSuccessHandler);
    orderRepository = module.get(IOrderRepository);
    inventoryClient = module.get(InventoryGrpcClient);
    eventBus = module.get(IEventBus);
    idempotency = module.get(IdempotencyService);
  });

  it('should handle payment success', async () => {
    orderRepository.findById.mockResolvedValue(mockOrder);

    const event: PaymentSucceededEvent = {
      eventId: 'evt-1',
      orderId: 'order-1',
      paymentId: 'pay-123',
      amount: 270,
      timestamp: new Date(),
    };

    await handler.handle(event);

    expect(orderRepository.save).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalled();
    expect(idempotency.markEventProcessed).toHaveBeenCalledWith('evt-1');
  });

  it('should skip already processed events', async () => {
    idempotency.isEventProcessed.mockResolvedValue(true);

    const event: PaymentSucceededEvent = {
      eventId: 'evt-1',
      orderId: 'order-1',
      paymentId: 'pay-123',
      amount: 270,
      timestamp: new Date(),
    };

    await handler.handle(event);

    expect(orderRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw error if order not found', async () => {
    orderRepository.findById.mockResolvedValue(null);

    const event: PaymentSucceededEvent = {
      eventId: 'evt-1',
      orderId: 'order-1',
      paymentId: 'pay-123',
      amount: 270,
      timestamp: new Date(),
    };

    await expect(handler.handle(event)).rejects.toThrow('Order order-1 not found');
  });
});
