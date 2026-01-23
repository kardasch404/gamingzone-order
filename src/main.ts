import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './presentation/filters/exception.filter';
import { appConfig } from './shared/config/app.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Order Service API')
    .setDescription('GamingZone Order Microservice')
    .setVersion('1.0')
    .addTag('orders')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(appConfig.port);
  console.log(`🚀 Order Service running on port ${appConfig.port}`);
  console.log(`📚 Swagger docs available at http://localhost:${appConfig.port}/api/docs`);
}
bootstrap();
