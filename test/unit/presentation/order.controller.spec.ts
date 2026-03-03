import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../../src/presentation/rest/controllers/order.controller';
import { CreateOrderUseCase } from '../../../src/application/use-cases/commands/create-order.use-case';
import { CancelOrderUseCase } from '../../../src/application/use-cases/commands/cancel-order.use-case';
import { GetOrderQueryHandler } from '../../../src/application/use-cases/queries/get-order.query';
import { GetUserOrdersQueryHandler } from '../../../src/application/use-cases/queries/get-user-orders.query';

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: CreateOrderUseCase, useValue: { execute: jest.fn() } },
        { provide: CancelOrderUseCase, useValue: { execute: jest.fn() } },
        { provide: GetOrderQueryHandler, useValue: { execute: jest.fn() } },
        { provide: GetUserOrdersQueryHandler, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
