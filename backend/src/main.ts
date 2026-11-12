import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Permite requisições do frontend
  configureApp(app); // ValidationPipe global

  // Documentação Swagger (UI em /docs, JSON em /docs-json)
  const config = new DocumentBuilder()
    .setTitle('DevStore API')
    .setDescription('API da DevStore: autenticação, produtos, categorias e pedidos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
