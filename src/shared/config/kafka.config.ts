export const kafkaConfig = {
  clientId: 'gamingzone-order',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  groupId: 'order-service-group',
};
