import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './../src/app.module';
import { configureApp } from '../src/app.setup';

describe('Swagger (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('should generate an OpenAPI document with all routes and bearer auth', () => {
    const config = new DocumentBuilder().addBearerAuth().build();
    const document = SwaggerModule.createDocument(app, config);

    expect(Object.keys(document.paths)).toEqual(
      expect.arrayContaining([
        '/auth/register',
        '/auth/login',
        '/auth/me',
        '/products',
        '/products/{id}',
        '/categories',
        '/categories/{id}',
        '/orders',
      ]),
    );
    expect(document.components?.securitySchemes).toHaveProperty('bearer');
    expect(document.components?.schemas).toEqual(
      expect.objectContaining({
        CreateProductDto: expect.anything(),
        UpdateProductDto: expect.anything(),
        ProductWithCategoryResponseDto: expect.anything(),
        OrderResponseDto: expect.anything(),
      }),
    );
    // PATCH /products/:id deve herdar as propriedades do CreateProductDto
    expect(
      (document.components?.schemas?.UpdateProductDto as { properties: object })
        .properties,
    ).toHaveProperty('name');
  });

  afterAll(async () => {
    await app.close();
  });
});
