import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Permite requisições do frontend
  configureApp(app); // ValidationPipe global

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
