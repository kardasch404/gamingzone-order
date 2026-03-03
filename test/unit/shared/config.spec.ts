import { appConfig } from '../../../src/shared/config/app.config';
import { databaseConfig } from '../../../src/shared/config/database.config';
import { kafkaConfig } from '../../../src/shared/config/kafka.config';

describe('Configuration', () => {
  describe('appConfig', () => {
    it('should have port property', () => {
      expect(appConfig.port).toBeDefined();
      expect(typeof appConfig.port).toBe('number');
    });

    it('should have environment property', () => {
      expect(appConfig.environment).toBeDefined();
    });

    it('should have serviceName property', () => {
      expect(appConfig.serviceName).toBe('gamingzone-order');
    });
  });

  describe('databaseConfig', () => {
    it('should have url property', () => {
      expect(databaseConfig.url).toBeDefined();
      expect(typeof databaseConfig.url).toBe('string');
    });
  });

  describe('kafkaConfig', () => {
    it('should have clientId property', () => {
      expect(kafkaConfig.clientId).toBe('gamingzone-order');
    });

    it('should have brokers array', () => {
      expect(Array.isArray(kafkaConfig.brokers)).toBe(true);
    });

    it('should have groupId property', () => {
      expect(kafkaConfig.groupId).toBe('order-service-group');
    });
  });
});
