import { BaseException } from '../../../src/shared/exceptions/base.exception';

class TestException extends BaseException {
  constructor() {
    super('Test error', 'TEST_ERROR', 400);
  }
}

describe('BaseException', () => {
  it('should create exception with correct properties', () => {
    const exception = new TestException();
    
    expect(exception.message).toBe('Test error');
    expect(exception.code).toBe('TEST_ERROR');
    expect(exception.statusCode).toBe(400);
    expect(exception.name).toBe('TestException');
  });

  it('should be instance of Error', () => {
    const exception = new TestException();
    expect(exception instanceof Error).toBe(true);
  });
});
