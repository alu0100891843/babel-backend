import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HandleErrorMiddleware } from './common/middlewares/handleError.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.useGlobalFilters(new HandleErrorMiddleware());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => console.error(error));
