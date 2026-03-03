import { BaseException } from '../../shared/exceptions/base.exception';

export class OrderNotFoundException extends BaseException {
  constructor(orderId: string) {
    super(`Order with ID ${orderId} not found`, 'ORDER_NOT_FOUND', 404);
  }
}
