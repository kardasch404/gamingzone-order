import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './presentation/filters/exception.filter';
import { appConfig } from './shared/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(appConfig.port);
  console.log(`🚀 Order Service running on port ${appConfig.port}`);
}
bootstrap();
