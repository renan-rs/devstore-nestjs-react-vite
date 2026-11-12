import { INestApplication, ValidationPipe } from '@nestjs/common';

// Configuração compartilhada entre a aplicação (main.ts) e os testes e2e,
// para que os testes rodem com as mesmas validações de produção.
export function configureApp(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
}
