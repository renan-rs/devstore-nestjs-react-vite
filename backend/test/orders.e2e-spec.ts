import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Orders (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let userId: string;
  let productId: string;
  let categoryId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    prisma = app.get(PrismaService);
    await app.init();

    // 1. Cria um user de teste para fazer login e obter um JWT real
    await request(app.getHttpServer()).post('/auth/register').send({
        name: 'Test E2E User',
        email: 'e2e@test.com',
        password: 'password123',
    });

    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
        email: 'e2e@test.com',
        password: 'password123',
    });

    authToken = loginResponse.body.access_token;
    userId = loginResponse.body.user.id;

    // 2. Cria uma categoria e um produto de teste no banco para usar nos pedidos
    const category = await prisma.category.create({
        data: {name: 'Testes E2E Orders', slug: 'testes-e2e-orders'},
    });
    categoryId = category.id;

    const product = await prisma.product.create({
        data: {
            name: 'Produto E2E Test',
            description: 'Descrição de teste',
            price: 100.0,
            stock: 5,
            imageUrl: 'https://via.placeholder.com/150',
            categoryId,
        },
    });

    productId = product.id;
  });

  it('/orders (POST) - shoudl fail if user is unauthorized', () => {
    return request(app.getHttpServer())
        .post('/orders')
        .send({
            items: [{productId, quantity: 1}],
        })
        .expect(401);
  });

  it('/orders (POST) - should create an order successfully when authenticated', () => {
    return request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
            items: [{productId, quantity: 2}],
        })
        .expect(201);
  });

  afterAll(async () => {
    // Limpa opcional do banco de dados de teste
    // Remove apenas os dados criados por este teste
    await prisma.orderItem.deleteMany({where: {order: {userId}}});
    await prisma.order.deleteMany({where: {userId}});
    await prisma.product.deleteMany({where: {id: productId}});
    await prisma.category.deleteMany({where: {id: categoryId}});
    await prisma.user.deleteMany({where: {email: 'e2e@test.com'}});
    await app.close();
  });
});
