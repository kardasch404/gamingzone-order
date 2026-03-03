import { OrderCacheService } from '../../../src/infrastructure/cache/order-cache.service';

describe('OrderCacheService', () => {
  let cacheService: OrderCacheService;

  beforeEach(() => {
    cacheService = new OrderCacheService();
  });

  describe('get and set', () => {
    it('should store and retrieve value', async () => {
      await cacheService.set('key1', { data: 'value' }, 60);
      const result = await cacheService.get('key1');

      expect(result).toEqual({ data: 'value' });
    });

    it('should return null for non-existent key', async () => {
      const result = await cacheService.get('non-existent');

      expect(result).toBeNull();
    });

    it('should return null for expired key', async () => {
      await cacheService.set('key1', 'value', 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      
      const result = await cacheService.get('key1');

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete key', async () => {
      await cacheService.set('key1', 'value');
      await cacheService.delete('key1');
      
      const result = await cacheService.get('key1');

      expect(result).toBeNull();
    });
  });

  describe('deletePattern', () => {
    it('should delete keys matching pattern', async () => {
      await cacheService.set('user:1:orders', 'data1');
      await cacheService.set('user:2:orders', 'data2');
      await cacheService.set('product:1', 'data3');

      await cacheService.deletePattern('user:.*:orders');

      expect(await cacheService.get('user:1:orders')).toBeNull();
      expect(await cacheService.get('user:2:orders')).toBeNull();
      expect(await cacheService.get('product:1')).not.toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all cache', async () => {
      await cacheService.set('key1', 'value1');
      await cacheService.set('key2', 'value2');

      await cacheService.clear();

      expect(await cacheService.get('key1')).toBeNull();
      expect(await cacheService.get('key2')).toBeNull();
    });
  });
});
